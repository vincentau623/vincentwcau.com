import type { DisplayMode, MarginBucket, RecentGame, TeamAnalysis } from "./types";

/** Share of 3+ run games for the active display mode (wins or losses). */
export function marginRatio(team: TeamAnalysis, mode: DisplayMode): number {
    return mode === "losses" ? team.lossRatio : team.winRatio;
}

/** Count 1-run, 2-run, and 3+ margins; ratio = over2 / total for wins or losses. */
export function bucketMargins(games: RecentGame[], won: boolean): MarginBucket {
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
