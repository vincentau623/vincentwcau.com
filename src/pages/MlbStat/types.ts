export type Theme = "light" | "dark";

export type ScheduleGame = {
    gamePk: number;
    gameDate: string;
    status: string;
    away: string;
    home: string;
    awayScore?: number;
    homeScore?: number;
};

export type StandingRecord = {
    teamId: number;
    teamName: string;
    division: string;
    wins: number;
    losses: number;
    pct: string;
};

export type RecentGame = {
    teamScore: number;
    oppScore: number;
    margin: number;
    won: boolean;
};

export type MarginBucket = {
    one: number;
    two: number;
    over2: number;
    total: number;
    ratio: number;
};

export type TeamAnalysis = {
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

export type DisplayMode = "all" | "wins" | "losses";