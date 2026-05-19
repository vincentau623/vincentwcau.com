import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StandingRecord, RecentGame, MarginBucket, TeamAnalysis, ScheduleGame, DisplayMode, Theme } from "./types";
import "./MlbStat.css";

function localeForLanguage(lng: string): string {
    return lng === "zh-Hant" ? "zh-TW" : "en-US";
}

function dateStr(d = new Date()) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status + " for " + url);
    return res.json() as Promise<T>;
}

async function getTeams() {
    const data = await fetchJson<{ teams?: { id: number; name: string }[] }>(
        "https://statsapi.mlb.com/api/v1/teams?sportId=1"
    );
    return data.teams || [];
}

async function getScheduleToday(): Promise<ScheduleGame[]> {
    const today = dateStr();
    const data = await fetchJson<{
        dates?: {
            games?: {
                gamePk: number;
                gameDate: string;
                status?: { detailedState?: string };
                teams?: {
                    away?: { team?: { name?: string }; score?: number };
                    home?: { team?: { name?: string }; score?: number };
                };
            }[];
        }[];
    }>(
        `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${today}`
    );
    return (data.dates?.[0]?.games || []).map((g) => ({
        gamePk: g.gamePk,
        gameDate: g.gameDate,
        status: g.status?.detailedState || "-",
        away: g.teams?.away?.team?.name || "-",
        home: g.teams?.home?.team?.name || "-",
        awayScore: g.teams?.away?.score,
        homeScore: g.teams?.home?.score,
    }));
}

async function getStandings(): Promise<StandingRecord[]> {
    const data = await fetchJson<{
        records?: {
            division?: { nameShort?: string; name?: string };
            teamRecords?: {
                team?: { id?: number; name?: string };
                wins: number;
                losses: number;
                winningPercentage: string;
            }[];
        }[];
    }>(
        "https://statsapi.mlb.com/api/v1/standings?leagueId=103,104&season=" +
        new Date().getFullYear() +
        "&standingsTypes=regularSeason"
    );
    const records: StandingRecord[] = [];
    for (const rec of data.records || []) {
        for (const tr of rec.teamRecords || []) {
            records.push({
                teamId: tr.team?.id ?? 0,
                teamName: tr.team?.name ?? "-",
                division: rec.division?.nameShort || rec.division?.name || "-",
                wins: tr.wins,
                losses: tr.losses,
                pct: tr.winningPercentage,
            });
        }
    }
    return records;
}

async function getRecentGames(teamId: number): Promise<RecentGame[]> {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 45);
    const qs = new URLSearchParams({
        sportId: "1",
        teamId: String(teamId),
        startDate: dateStr(start),
        endDate: dateStr(end),
        gameType: "R",
    });
    const data = await fetchJson<{
        dates?: {
            games?: {
                teams?: {
                    away?: { team?: { id?: number }; score?: number };
                    home?: { team?: { id?: number }; score?: number };
                };
            }[];
        }[];
    }>("https://statsapi.mlb.com/api/v1/schedule?" + qs.toString());
    const games: RecentGame[] = [];
    for (const date of data.dates || []) {
        for (const g of date.games || []) {
            const awayId = g.teams?.away?.team?.id;
            const awayScore = g.teams?.away?.score;
            const homeScore = g.teams?.home?.score;
            if (awayScore == null || homeScore == null) continue;
            const isTargetAway = awayId === teamId;
            const teamScore = isTargetAway ? awayScore : homeScore;
            const oppScore = isTargetAway ? homeScore : awayScore;
            games.push({
                teamScore,
                oppScore,
                margin: Math.abs(teamScore - oppScore),
                won: teamScore > oppScore,
            });
        }
    }
    return games.slice(-30);
}

function marginRatio(team: TeamAnalysis, mode: DisplayMode): number {
    return mode === "losses" ? team.lossRatio : team.winRatio;
}

function bucketMargins(games: RecentGame[], won: boolean): MarginBucket {
    const subset = games.filter((g) => g.won === won);
    const out: MarginBucket = {
        one: 0,
        two: 0,
        over2: 0,
        total: subset.length,
        ratio: 0,
    };
    subset.forEach((g) => {
        if (g.margin === 1) out.one++;
        else if (g.margin === 2) out.two++;
        else if (g.margin > 2) out.over2++;
    });
    out.ratio = out.total ? out.over2 / out.total : 0;
    return out;
}

function MarginPill({ ratio, threshold }: { ratio: number; threshold: number }) {
    const { t } = useTranslation("mlbStat");
    if (ratio >= threshold) {
        return <span className="mlb-stat-pill good">{t("pill.high")}</span>;
    }
    if (ratio <= 0.45) {
        return <span className="mlb-stat-pill bad">{t("pill.low")}</span>;
    }
    return <span className="mlb-stat-pill neutral">{t("pill.neutral")}</span>;
}

const MlbStat = () => {
    const { t, i18n } = useTranslation("mlbStat");
    const dateLocale = localeForLanguage(i18n.language);

    const [theme, setTheme] = useState<Theme>(() =>
        matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    );
    const [teams, setTeams] = useState<TeamAnalysis[]>([]);
    const [schedule, setSchedule] = useState<ScheduleGame[]>([]);
    const [divisions, setDivisions] = useState<string[]>([]);
    const [statusText, setStatusText] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [teamFilter, setTeamFilter] = useState("");
    const [divisionFilter, setDivisionFilter] = useState("");
    const [thresholdFilter, setThresholdFilter] = useState("0.66");
    const [modeFilter, setModeFilter] = useState<DisplayMode>("all");

    useEffect(() => {
        document.documentElement.classList.add("mlb-stat-page");
        return () => {
            document.documentElement.classList.remove("mlb-stat-page");
            delete document.documentElement.dataset.mlbTheme;
        };
    }, []);

    useEffect(() => {
        document.documentElement.dataset.mlbTheme = theme;
    }, [theme]);

    useEffect(() => {
        setStatusText(t("status.waiting"));
    }, [t]);

    const loadAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        setStatusText(t("status.loading"));
        try {
            const [teamList, scheduleData, standings] = await Promise.all([
                getTeams(),
                getScheduleToday(),
                getStandings(),
            ]);
            setSchedule(scheduleData);

            const divisionList = [
                ...new Set(
                    standings.map((s) => s.division).filter(Boolean)
                ),
            ].sort();
            setDivisions(divisionList);

            const analysis: TeamAnalysis[] = [];
            for (const team of teamList) {
                const standing = standings.find((s) => s.teamId === team.id);
                if (!standing) continue;
                const recent = await getRecentGames(team.id);
                const wins = bucketMargins(recent, true);
                const losses = bucketMargins(recent, false);
                analysis.push({
                    teamId: team.id,
                    teamName: team.name,
                    division: standing.division,
                    winsSeason: standing.wins,
                    lossesSeason: standing.losses,
                    pct: standing.pct,
                    winOne: wins.one,
                    winTwo: wins.two,
                    winOver2: wins.over2,
                    winRatio: wins.ratio,
                    lossOne: losses.one,
                    lossTwo: losses.two,
                    lossOver2: losses.over2,
                    lossRatio: losses.ratio,
                    recentCount: recent.length,
                });
            }
            setTeams(analysis.sort((a, b) => b.winRatio - a.winRatio));
            setStatusText(
                t("status.updated", {
                    time: new Date().toLocaleString(dateLocale),
                })
            );
        } catch (err) {
            console.error(err);
            const message =
                err instanceof Error ? err.message : "Unknown error";
            setError(message);
            setStatusText(t("status.failed"));
        } finally {
            setLoading(false);
        }
    }, [t, dateLocale]);

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    const showAllTeams = thresholdFilter === "all";
    const pillThreshold = showAllTeams
        ? 0.66
        : Number(thresholdFilter || 0.66);

    const filteredTeams = useMemo(() => {
        const keyword = teamFilter.trim().toLowerCase();
        return teams
            .filter((team) => {
                if (
                    keyword &&
                    !team.teamName.toLowerCase().includes(keyword)
                ) {
                    return false;
                }
                if (divisionFilter && team.division !== divisionFilter) {
                    return false;
                }
                if (
                    !showAllTeams &&
                    marginRatio(team, modeFilter) < pillThreshold
                ) {
                    return false;
                }
                return true;
            })
            .sort(
                (a, b) =>
                    marginRatio(b, modeFilter) - marginRatio(a, modeFilter)
            );
    }, [
        teams,
        teamFilter,
        divisionFilter,
        modeFilter,
        showAllTeams,
        pillThreshold,
    ]);

    const highMarginCount = useMemo(
        () =>
            filteredTeams.filter(
                (team) => marginRatio(team, modeFilter) >= pillThreshold
            ).length,
        [filteredTeams, modeFilter, pillThreshold]
    );

    const filteredSchedule = useMemo(() => {
        const keyword = teamFilter.trim().toLowerCase();
        if (!keyword) return schedule;
        return schedule.filter(
            (game) =>
                game.away.toLowerCase().includes(keyword) ||
                game.home.toLowerCase().includes(keyword)
        );
    }, [schedule, teamFilter]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <div
            className="mlb-stat-root"
            data-theme={theme}
            lang={i18n.language}
        >
            <a className="mlb-stat-skip" href="#mlb-stat-main">
                {t("a11y.skipToContent")}
            </a>
            <div className="mlb-stat-wrap">
                <header className="mlb-stat-header">
                    <div className="mlb-stat-brand">
                        <svg
                            className="mlb-stat-logo"
                            viewBox="0 0 64 64"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            aria-label={t("a11y.logo")}
                        >
                            <rect
                                x="6"
                                y="10"
                                width="52"
                                height="44"
                                rx="10"
                            />
                            <path d="M18 42c7-16 21-25 28-20 6 5 1 18-12 24" />
                            <circle
                                cx="44"
                                cy="24"
                                r="4"
                                fill="currentColor"
                                stroke="none"
                            />
                        </svg>
                        <div>
                            <h1>{t("title")}</h1>
                            <div className="mlb-stat-muted">{t("subtitle")}</div>
                        </div>
                    </div>
                    <div className="mlb-stat-top-actions">
                        <a className="mlb-stat-btn" href="/">
                            {t("nav.home")}
                        </a>
                        <select
                            className="mlb-stat-btn mlb-stat-lang"
                            value={i18n.language}
                            onChange={(e) =>
                                void i18n.changeLanguage(e.target.value)
                            }
                            aria-label={t("lang.switch")}
                        >
                            <option value="zh-Hant">{t("lang.zhHant")}</option>
                            <option value="en">{t("lang.en")}</option>
                        </select>
                        <button
                            type="button"
                            className="mlb-stat-btn"
                            onClick={toggleTheme}
                            aria-label={t("a11y.toggleTheme")}
                        >
                            {theme === "dark" ? "☀️" : "🌙"}
                        </button>
                        <button
                            type="button"
                            className="mlb-stat-btn primary"
                            onClick={loadAll}
                            disabled={loading}
                        >
                            {t("actions.refresh")}
                        </button>
                    </div>
                </header>

                <main id="mlb-stat-main">
                    <section className="mlb-stat-hero">
                        <article className="mlb-stat-panel mlb-stat-hero-card">
                            <div className="mlb-stat-muted">{t("hero.purposeLabel")}</div>
                            <p>{t("hero.purposeText")}</p>
                        </article>
                        <aside className="mlb-stat-panel mlb-stat-hero-card">
                            <div className="mlb-stat-muted">{t("hero.statusLabel")}</div>
                            <div>{statusText}</div>
                            <div
                                className="mlb-stat-muted"
                                style={{ marginTop: "1rem" }}
                            >
                                {t("hero.statusNote")}
                            </div>
                        </aside>
                    </section>

                    <section
                        className="mlb-stat-grid"
                        aria-label={t("a11y.summaryCards")}
                    >
                        <div className="mlb-stat-panel mlb-stat-stat">
                            <div className="label">{t("stats.gamesToday")}</div>
                            <div className="value">{filteredSchedule.length}</div>
                        </div>
                        <div className="mlb-stat-panel mlb-stat-stat">
                            <div className="label">{t("stats.teamsAnalyzed")}</div>
                            <div className="value">{teams.length}</div>
                        </div>
                        <div className="mlb-stat-panel mlb-stat-stat">
                            <div className="label">{t("stats.highMarginTeams")}</div>
                            <div className="value">{highMarginCount}</div>
                        </div>
                    </section>

                    <section
                        className="mlb-stat-panel"
                        aria-labelledby="controls-title"
                    >
                        <div className="mlb-stat-section-head">
                            <div>
                                <h2 id="controls-title">{t("filters.title")}</h2>
                                <div className="mlb-stat-note">{t("filters.note")}</div>
                            </div>
                        </div>
                        <div className="mlb-stat-controls">
                            <div>
                                <label htmlFor="teamFilter">{t("filters.teamSearch")}</label>
                                <input
                                    id="teamFilter"
                                    type="text"
                                    placeholder={t("filters.teamPlaceholder")}
                                    value={teamFilter}
                                    onChange={(e) =>
                                        setTeamFilter(e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label htmlFor="divisionFilter">{t("filters.division")}</label>
                                <select
                                    id="divisionFilter"
                                    value={divisionFilter}
                                    onChange={(e) =>
                                        setDivisionFilter(e.target.value)
                                    }
                                >
                                    <option value="">{t("filters.all")}</option>
                                    {divisions.map((d) => (
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="thresholdFilter">
                                    {t("filters.threshold")}
                                </label>
                                <select
                                    id="thresholdFilter"
                                    value={thresholdFilter}
                                    onChange={(e) =>
                                        setThresholdFilter(e.target.value)
                                    }
                                >
                                    <option value="all">
                                        {t("filters.thresholdAll")}
                                    </option>
                                    <option value="0.55">55%</option>
                                    <option value="0.66">66%</option>
                                    <option value="0.7">70%</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="modeFilter">{t("filters.displayMode")}</label>
                                <select
                                    id="modeFilter"
                                    value={modeFilter}
                                    onChange={(e) =>
                                        setModeFilter(
                                            e.target.value as DisplayMode
                                        )
                                    }
                                >
                                    <option value="all">{t("filters.all")}</option>
                                    <option value="wins">{t("filters.winsOnly")}</option>
                                    <option value="losses">{t("filters.lossesOnly")}</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section
                        className="mlb-stat-panel mlb-stat-spaced"
                    >
                        <div className="mlb-stat-section-head">
                            <div>
                                <h2>{t("analysis.title")}</h2>
                                <div className="mlb-stat-note">{t("analysis.note")}</div>
                            </div>
                        </div>
                        <div className="mlb-stat-table-wrap">
                            {loading ? (
                                <div className="mlb-stat-loading">
                                    {t("loading")}
                                </div>
                            ) : error ? (
                                <div className="mlb-stat-error">
                                    {t("error.loadFailed", { error })}
                                </div>
                            ) : filteredTeams.length === 0 ? (
                                <div className="mlb-stat-loading">{t("noTeams")}</div>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>{t("table.team")}</th>
                                            <th>{t("table.division")}</th>
                                            <th>{t("table.record")}</th>
                                            <th>{t("table.winMargin")}</th>
                                            <th>{t("table.winOver2Pct")}</th>
                                            <th>{t("table.lossMargin")}</th>
                                            <th>{t("table.lossOver2Pct")}</th>
                                            <th>{t("table.verdict")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTeams.map((team) => {
                                            const targetRatio = marginRatio(
                                                team,
                                                modeFilter
                                            );
                                            return (
                                                <tr key={team.teamId}>
                                                    <td>
                                                        <strong>
                                                            {team.teamName}
                                                        </strong>
                                                        <div className="mlb-stat-muted">
                                                            {t("recentGames", {
                                                                count: team.recentCount,
                                                            })}
                                                        </div>
                                                    </td>
                                                    <td>{team.division}</td>
                                                    <td>
                                                        {team.winsSeason}-
                                                        {team.lossesSeason} (
                                                        {team.pct})
                                                    </td>
                                                    <td>
                                                        {team.winOne}-{team.winTwo}-
                                                        {team.winOver2}
                                                    </td>
                                                    <td>
                                                        {(team.winRatio * 100).toFixed(
                                                            1
                                                        )}
                                                        %
                                                    </td>
                                                    <td>
                                                        {team.lossOne}-{team.lossTwo}-
                                                        {team.lossOver2}
                                                    </td>
                                                    <td>
                                                        {(
                                                            team.lossRatio * 100
                                                        ).toFixed(1)}
                                                        %
                                                    </td>
                                                    <td>
                                                        <MarginPill
                                                            ratio={targetRatio}
                                                            threshold={
                                                                pillThreshold
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </section>

                    <section
                        className="mlb-stat-panel mlb-stat-spaced"
                    >
                        <div className="mlb-stat-section-head">
                            <div>
                                <h2>{t("schedule.title")}</h2>
                                <div className="mlb-stat-note">{t("schedule.note")}</div>
                            </div>
                        </div>
                        <div className="mlb-stat-table-wrap">
                            {loading ? (
                                <div className="mlb-stat-loading">
                                    {t("loading")}
                                </div>
                            ) : error ? (
                                <div className="mlb-stat-error">
                                    {t("error.loadFailed", { error })}
                                </div>
                            ) : filteredSchedule.length === 0 ? (
                                <div className="mlb-stat-loading">
                                    {t("schedule.empty")}
                                </div>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>{t("schedule.matchup")}</th>
                                            <th>{t("schedule.time")}</th>
                                            <th>{t("schedule.status")}</th>
                                            <th>{t("schedule.score")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredSchedule.map((g) => (
                                            <tr key={g.gamePk}>
                                                <td>
                                                    {g.away} @ {g.home}
                                                </td>
                                                <td>
                                                    {new Date(
                                                        g.gameDate
                                                    ).toLocaleString(dateLocale, {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        month: "2-digit",
                                                        day: "2-digit",
                                                    })}
                                                </td>
                                                <td>{g.status}</td>
                                                <td>
                                                    {g.awayScore ?? "-"} :{" "}
                                                    {g.homeScore ?? "-"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </section>
                </main>

                <footer className="mlb-stat-footer">{t("footer")}</footer>
            </div>
        </div>
    );
};

export default MlbStat;
