import { useCallback, useEffect, useMemo, useState } from "react";
import "./MlbStat.css";

type Theme = "light" | "dark";

type ScheduleGame = {
    gamePk: number;
    gameDate: string;
    status: string;
    away: string;
    home: string;
    awayScore?: number;
    homeScore?: number;
};

type StandingRecord = {
    teamId: number;
    teamName: string;
    division: string;
    wins: number;
    losses: number;
    pct: string;
};

type RecentGame = {
    teamScore: number;
    oppScore: number;
    margin: number;
    won: boolean;
};

type MarginBucket = {
    one: number;
    two: number;
    over2: number;
    total: number;
    ratio: number;
};

type TeamAnalysis = {
    teamId: number;
    teamName: string;
    division: string;
    winsSeason: number;
    lossesSeason: number;
    pct: string;
    winOne: number;
    winTwo: number;
    winOver2: number;
    winRatio: number;
    lossOne: number;
    lossTwo: number;
    lossOver2: number;
    lossRatio: number;
    recentCount: number;
};

type DisplayMode = "all" | "wins" | "losses";

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
    if (ratio >= threshold) {
        return <span className="mlb-stat-pill good">偏高</span>;
    }
    if (ratio <= 0.45) {
        return <span className="mlb-stat-pill bad">偏低</span>;
    }
    return <span className="mlb-stat-pill neutral">一般</span>;
}

const MlbStat = () => {
    const [theme, setTheme] = useState<Theme>(() =>
        matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    );
    const [teams, setTeams] = useState<TeamAnalysis[]>([]);
    const [schedule, setSchedule] = useState<ScheduleGame[]>([]);
    const [divisions, setDivisions] = useState<string[]>([]);
    const [statusText, setStatusText] = useState("等待載入資料…");
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

    const loadAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        setStatusText("讀取球隊、戰績與近期賽程中…");
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
            setStatusText(`更新完成：${new Date().toLocaleString("zh-TW")}`);
        } catch (err) {
            console.error(err);
            const message =
                err instanceof Error ? err.message : "Unknown error";
            setError(message);
            setStatusText("載入失敗");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    const threshold = Number(thresholdFilter || 0.66);

    const filteredTeams = useMemo(() => {
        const keyword = teamFilter.trim().toLowerCase();
        return teams
            .filter(
                (t) =>
                    (!keyword ||
                        t.teamName.toLowerCase().includes(keyword)) &&
                    (!divisionFilter || t.division === divisionFilter)
            )
            .sort((a, b) => {
                const av = modeFilter === "losses" ? a.lossRatio : a.winRatio;
                const bv = modeFilter === "losses" ? b.lossRatio : b.winRatio;
                return bv - av;
            });
    }, [teams, teamFilter, divisionFilter, modeFilter]);

    const highMarginCount = useMemo(
        () =>
            filteredTeams.filter((t) => {
                const ratio =
                    modeFilter === "losses" ? t.lossRatio : t.winRatio;
                return ratio >= threshold;
            }).length,
        [filteredTeams, modeFilter, threshold]
    );

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <div
            className="mlb-stat-root"
            data-theme={theme}
            lang="zh-Hant"
        >
            <a className="mlb-stat-skip" href="#mlb-stat-main">
                Skip to content
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
                            aria-label="MLB Margin logo"
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
                            <h1>MLB 勝分差面板</h1>
                            <div className="mlb-stat-muted">
                                用 JavaScript 直接抓 MLB Stats API，顯示賽程、戰績與大比分傾向。
                            </div>
                        </div>
                    </div>
                    <div className="mlb-stat-top-actions">
                        <a className="mlb-stat-btn" href="/">
                            ← 首頁
                        </a>
                        <button
                            type="button"
                            className="mlb-stat-btn"
                            onClick={toggleTheme}
                            aria-label="切換深色模式"
                        >
                            {theme === "dark" ? "☀️" : "🌙"}
                        </button>
                        <button
                            type="button"
                            className="mlb-stat-btn primary"
                            onClick={loadAll}
                            disabled={loading}
                        >
                            重新整理
                        </button>
                    </div>
                </header>

                <main id="mlb-stat-main">
                    <section className="mlb-stat-hero">
                        <article className="mlb-stat-panel mlb-stat-hero-card">
                            <div className="mlb-stat-muted">資料用途</div>
                            <p>
                                這個頁面示範如何在前端直接讀取 MLB 官方公開 Stats
                                API，先拉今日賽程與聯盟戰績，再用最近比賽的比分差做出「1分、2分、超過2分」分類。你可以把它延伸成你之前提到的勝分差觀察工具。
                            </p>
                        </article>
                        <aside className="mlb-stat-panel mlb-stat-hero-card">
                            <div className="mlb-stat-muted">目前狀態</div>
                            <div>{statusText}</div>
                            <div
                                className="mlb-stat-muted"
                                style={{ marginTop: "1rem" }}
                            >
                                預設抓取：MLB 全聯盟、今天賽程、每隊最近 30
                                場已完賽。
                            </div>
                        </aside>
                    </section>

                    <section className="mlb-stat-grid" aria-label="summary cards">
                        <div className="mlb-stat-panel mlb-stat-stat">
                            <div className="label">今日比賽數</div>
                            <div className="value">{schedule.length}</div>
                        </div>
                        <div className="mlb-stat-panel mlb-stat-stat">
                            <div className="label">分析球隊數</div>
                            <div className="value">{teams.length}</div>
                        </div>
                        <div className="mlb-stat-panel mlb-stat-stat">
                            <div className="label">大比分偏高隊數</div>
                            <div className="value">{highMarginCount}</div>
                        </div>
                    </section>

                    <section
                        className="mlb-stat-panel"
                        aria-labelledby="controls-title"
                    >
                        <div className="mlb-stat-section-head">
                            <div>
                                <h2 id="controls-title">篩選設定</h2>
                                <div className="mlb-stat-note">
                                    可用聯盟分區、球隊名稱搜尋，或調整「超過2分占比」門檻。
                                </div>
                            </div>
                        </div>
                        <div className="mlb-stat-controls">
                            <div>
                                <label htmlFor="teamFilter">球隊搜尋</label>
                                <input
                                    id="teamFilter"
                                    type="text"
                                    placeholder="例如 Giants"
                                    value={teamFilter}
                                    onChange={(e) =>
                                        setTeamFilter(e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label htmlFor="divisionFilter">分區</label>
                                <select
                                    id="divisionFilter"
                                    value={divisionFilter}
                                    onChange={(e) =>
                                        setDivisionFilter(e.target.value)
                                    }
                                >
                                    <option value="">全部</option>
                                    {divisions.map((d) => (
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="thresholdFilter">
                                    大比分門檻
                                </label>
                                <select
                                    id="thresholdFilter"
                                    value={thresholdFilter}
                                    onChange={(e) =>
                                        setThresholdFilter(e.target.value)
                                    }
                                >
                                    <option value="0.55">55%</option>
                                    <option value="0.66">66%</option>
                                    <option value="0.7">70%</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="modeFilter">顯示模式</label>
                                <select
                                    id="modeFilter"
                                    value={modeFilter}
                                    onChange={(e) =>
                                        setModeFilter(
                                            e.target.value as DisplayMode
                                        )
                                    }
                                >
                                    <option value="all">全部</option>
                                    <option value="wins">只看贏球分布</option>
                                    <option value="losses">只看輸球分布</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section
                        className="mlb-stat-panel mlb-stat-spaced"
                    >
                        <div className="mlb-stat-section-head">
                            <div>
                                <h2>球隊勝分差分析</h2>
                                <div className="mlb-stat-note">
                                    最近 30 場已完賽，將比分差分成 1 分、2 分、超過
                                    2 分，並標示是否高於你設定的門檻。
                                </div>
                            </div>
                        </div>
                        <div className="mlb-stat-table-wrap">
                            {loading ? (
                                <div className="mlb-stat-loading">
                                    載入中…
                                </div>
                            ) : error ? (
                                <div className="mlb-stat-error">
                                    資料讀取失敗：{error}
                                </div>
                            ) : filteredTeams.length === 0 ? (
                                <div className="mlb-stat-loading">
                                    沒有符合條件的球隊。
                                </div>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>球隊</th>
                                            <th>分區</th>
                                            <th>戰績</th>
                                            <th>贏球 1-2-3+</th>
                                            <th>贏球 3+ 比例</th>
                                            <th>輸球 1-2-3+</th>
                                            <th>輸球 3+ 比例</th>
                                            <th>判定</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTeams.map((t) => {
                                            const targetRatio =
                                                modeFilter === "losses"
                                                    ? t.lossRatio
                                                    : t.winRatio;
                                            return (
                                                <tr key={t.teamId}>
                                                    <td>
                                                        <strong>
                                                            {t.teamName}
                                                        </strong>
                                                        <div className="mlb-stat-muted">
                                                            近 {t.recentCount}{" "}
                                                            場
                                                        </div>
                                                    </td>
                                                    <td>{t.division}</td>
                                                    <td>
                                                        {t.winsSeason}-
                                                        {t.lossesSeason} (
                                                        {t.pct})
                                                    </td>
                                                    <td>
                                                        {t.winOne}-{t.winTwo}-
                                                        {t.winOver2}
                                                    </td>
                                                    <td>
                                                        {(t.winRatio * 100).toFixed(
                                                            1
                                                        )}
                                                        %
                                                    </td>
                                                    <td>
                                                        {t.lossOne}-{t.lossTwo}-
                                                        {t.lossOver2}
                                                    </td>
                                                    <td>
                                                        {(
                                                            t.lossRatio * 100
                                                        ).toFixed(1)}
                                                        %
                                                    </td>
                                                    <td>
                                                        <MarginPill
                                                            ratio={targetRatio}
                                                            threshold={
                                                                threshold
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
                                <h2>今日賽程</h2>
                                <div className="mlb-stat-note">
                                    顯示今日 MLB 賽程與開賽時間，資料來自官方
                                    schedule endpoint。
                                </div>
                            </div>
                        </div>
                        <div className="mlb-stat-table-wrap">
                            {loading ? (
                                <div className="mlb-stat-loading">
                                    載入中…
                                </div>
                            ) : error ? (
                                <div className="mlb-stat-error">
                                    資料讀取失敗：{error}
                                </div>
                            ) : schedule.length === 0 ? (
                                <div className="mlb-stat-loading">
                                    今日沒有賽程資料。
                                </div>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>對戰</th>
                                            <th>時間</th>
                                            <th>狀態</th>
                                            <th>比分</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schedule.map((g) => (
                                            <tr key={g.gamePk}>
                                                <td>
                                                    {g.away} @ {g.home}
                                                </td>
                                                <td>
                                                    {new Date(
                                                        g.gameDate
                                                    ).toLocaleString("zh-TW", {
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

                <footer className="mlb-stat-footer">
                    資料來源：MLB Stats API。前端直接呼叫官方公開 API。
                </footer>
            </div>
        </div>
    );
};

export default MlbStat;
