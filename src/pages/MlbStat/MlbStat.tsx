/**
 * MLB run-differential dashboard.
 * Fetches public MLB Stats API data in the browser, buckets recent game margins,
 * and lets users filter/sort teams by blowout tendency (3+ run wins or losses).
 */
import { useTranslation } from "react-i18next";
import { MlbStatAnalysisTable } from "./components/MlbStatAnalysisTable";
import { MlbStatFilters } from "./components/MlbStatFilters";
import { MlbStatHeader } from "./components/MlbStatHeader";
import { MlbStatHero } from "./components/MlbStatHero";
import { MlbStatScheduleTable } from "./components/MlbStatScheduleTable";
import { MlbStatSummary } from "./components/MlbStatSummary";
import { useMlbStatData } from "./hooks/useMlbStatData";
import { useMlbStatFilters } from "./hooks/useMlbStatFilters";
import { useMlbStatTheme } from "./hooks/useMlbStatTheme";
import "./MlbStat.css";
import { localeForLanguage } from "./utils";

const MlbStat = () => {
    const { t, i18n } = useTranslation("mlbStat");
    const dateLocale = localeForLanguage(i18n.language);
    const { theme, toggleTheme } = useMlbStatTheme();

    const {
        teams,
        schedule,
        divisions,
        statusText,
        loading,
        error,
        loadAll,
    } = useMlbStatData(t, dateLocale);

    const {
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
    } = useMlbStatFilters(teams, schedule);

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
                <MlbStatHeader
                    theme={theme}
                    loading={loading}
                    onToggleTheme={toggleTheme}
                    onRefresh={loadAll}
                />

                <main id="mlb-stat-main">
                    <MlbStatHero statusText={statusText} />
                    <MlbStatSummary
                        gamesToday={filteredSchedule.length}
                        teamsAnalyzed={teams.length}
                        highMarginCount={highMarginCount}
                    />
                    <MlbStatFilters
                        divisions={divisions}
                        teamFilter={teamFilter}
                        divisionFilter={divisionFilter}
                        thresholdFilter={thresholdFilter}
                        modeFilter={modeFilter}
                        onTeamFilterChange={setTeamFilter}
                        onDivisionFilterChange={setDivisionFilter}
                        onThresholdFilterChange={setThresholdFilter}
                        onModeFilterChange={setModeFilter}
                    />
                    <MlbStatAnalysisTable
                        loading={loading}
                        error={error}
                        teams={filteredTeams}
                        modeFilter={modeFilter}
                        pillThreshold={pillThreshold}
                    />
                    <MlbStatScheduleTable
                        loading={loading}
                        error={error}
                        games={filteredSchedule}
                        dateLocale={dateLocale}
                    />
                </main>

                <footer className="mlb-stat-footer">{t("footer")}</footer>
            </div>
        </div>
    );
};

export default MlbStat;
