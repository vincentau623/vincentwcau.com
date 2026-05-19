const BLUE_JAYS_TEAM_ID = 141;
const MLB_SCHEDULE = "https://statsapi.mlb.com/api/v1/schedule";
const MLB_STANDINGS =
    "https://statsapi.mlb.com/api/v1/standings?leagueId=103,104&standingsTypes=regularSeason";

export type BlueJaysGame = {
    gamePk: number;
    gameDate: string;
    status: string;
    isHome: boolean;
    opponent: string;
    jaysScore?: number;
    oppScore?: number;
    won?: boolean;
    jaysRecord?: string;
    opponentRecord?: string;
};

export const gamedayUrl = (gamePk: number) =>
    `https://www.mlb.com/gameday/${gamePk}`;

export type BlueJaysStanding = {
    wins: number;
    losses: number;
    pct: string;
    division: string;
    gamesBack: string;
};

function dateStr(d = new Date()): string {
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

type ApiTeamSide = {
    team?: { id?: number; name?: string };
    score?: number;
    leagueRecord?: { wins?: number; losses?: number };
};

type ApiGame = {
    gamePk: number;
    gameDate: string;
    status?: { detailedState?: string };
    teams?: {
        away?: ApiTeamSide;
        home?: ApiTeamSide;
    };
};

function formatRecord(
    rec?: { wins?: number; losses?: number }
): string | undefined {
    if (rec?.wins == null || rec?.losses == null) return undefined;
    return `${rec.wins}-${rec.losses}`;
}

function parseGame(g: ApiGame): BlueJaysGame {
    const away = g.teams?.away;
    const home = g.teams?.home;
    const isHome = home?.team?.id === BLUE_JAYS_TEAM_ID;
    const jays = isHome ? home : away;
    const opp = isHome ? away : home;
    const jaysScore = jays?.score;
    const oppScore = opp?.score;

    return {
        gamePk: g.gamePk,
        gameDate: g.gameDate,
        status: g.status?.detailedState || "-",
        isHome,
        opponent: opp?.team?.name || "-",
        jaysScore,
        oppScore,
        won:
            jaysScore != null && oppScore != null
                ? jaysScore > oppScore
                : undefined,
        jaysRecord: formatRecord(jays?.leagueRecord),
        opponentRecord: formatRecord(opp?.leagueRecord),
    };
}

export async function getBlueJaysStanding(
    season = new Date().getFullYear()
): Promise<BlueJaysStanding | null> {
    const data = await fetchJson<{
        records?: {
            division?: { nameShort?: string; name?: string };
            teamRecords?: {
                team?: { id?: number };
                wins: number;
                losses: number;
                winningPercentage: string;
                gamesBack: string;
            }[];
        }[];
    }>(`${MLB_STANDINGS}&season=${season}`);

    for (const rec of data.records || []) {
        const team = rec.teamRecords?.find(
            (tr) => tr.team?.id === BLUE_JAYS_TEAM_ID
        );
        if (team) {
            return {
                wins: team.wins,
                losses: team.losses,
                pct: team.winningPercentage,
                division: rec.division?.nameShort || rec.division?.name || "-",
                gamesBack: team.gamesBack,
            };
        }
    }
    return null;
}

export async function getBlueJaysGames(): Promise<{
    upcoming: BlueJaysGame[];
    recent: BlueJaysGame[];
}> {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 30);
    const end = new Date(today);
    end.setDate(today.getDate() + 365);

    const qs = new URLSearchParams({
        sportId: "1",
        teamId: String(BLUE_JAYS_TEAM_ID),
        startDate: dateStr(start),
        endDate: dateStr(end),
        gameType: "R",
    });

    const data = await fetchJson<{ dates?: { games?: ApiGame[] }[] }>(
        `${MLB_SCHEDULE}?${qs.toString()}`
    );

    const all: BlueJaysGame[] = [];
    for (const date of data.dates || []) {
        for (const g of date.games || []) {
            all.push(parseGame(g));
        }
    }

    const upcoming = all
        .filter((g) => g.status !== "Final")
        .sort(
            (a, b) =>
                new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime()
        );

    const recent = all
        .filter((g) => g.status === "Final")
        .sort(
            (a, b) =>
                new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime()
        )
        .slice(0, 10);

    return { upcoming, recent };
}
