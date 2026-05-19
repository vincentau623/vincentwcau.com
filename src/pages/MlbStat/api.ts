import type { RecentGame, ScheduleGame, StandingRecord } from "./types";
import { dateStr } from "./utils";

async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status + " for " + url);
    return res.json() as Promise<T>;
}

export async function getTeams() {
    const data = await fetchJson<{ teams?: { id: number; name: string }[] }>(
        "https://statsapi.mlb.com/api/v1/teams?sportId=1"
    );
    return data.teams || [];
}

export async function getScheduleToday(): Promise<ScheduleGame[]> {
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

export async function getStandings(): Promise<StandingRecord[]> {
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

/** Last 30 completed regular-season games for a team (scores required). */
export async function getRecentGames(teamId: number): Promise<RecentGame[]> {
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
