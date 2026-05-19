import { useCallback, useEffect, useState } from "react";
import type { TFunction } from "i18next";
import { getRecentGames, getScheduleToday, getStandings, getTeams } from "../api";
import { bucketMargins } from "../margins";
import type { ScheduleGame, TeamAnalysis } from "../types";

export function useMlbStatData(t: TFunction<"mlbStat">, dateLocale: string) {
    const [teams, setTeams] = useState<TeamAnalysis[]>([]);
    const [schedule, setSchedule] = useState<ScheduleGame[]>([]);
    const [divisions, setDivisions] = useState<string[]>([]);
    const [statusText, setStatusText] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            setDivisions(
                [...new Set(standings.map((s) => s.division).filter(Boolean))].sort()
            );

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
            setError(err instanceof Error ? err.message : "Unknown error");
            setStatusText(t("status.failed"));
        } finally {
            setLoading(false);
        }
    }, [t, dateLocale]);

    useEffect(() => {
        void loadAll();
    }, [loadAll]);

    return {
        teams,
        schedule,
        divisions,
        statusText,
        loading,
        error,
        loadAll,
    };
}
