import { useMemo, useState } from "react";
import { marginRatio } from "../margins";
import type { DisplayMode, ScheduleGame, TeamAnalysis } from "../types";

export function useMlbStatFilters(teams: TeamAnalysis[], schedule: ScheduleGame[]) {
    const [teamFilter, setTeamFilter] = useState("");
    const [divisionFilter, setDivisionFilter] = useState("");
    const [thresholdFilter, setThresholdFilter] = useState("0.66");
    const [modeFilter, setModeFilter] = useState<DisplayMode>("all");

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

    return {
        teamFilter,
        setTeamFilter,
        divisionFilter,
        setDivisionFilter,
        thresholdFilter,
        setThresholdFilter,
        modeFilter,
        setModeFilter,
        pillThreshold,
        filteredTeams,
        filteredSchedule,
        highMarginCount,
    };
}
