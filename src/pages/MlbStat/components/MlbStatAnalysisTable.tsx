import { useTranslation } from "react-i18next";
import { marginRatio } from "../margins";
import type { DisplayMode, TeamAnalysis } from "../types";
import { DataPanel } from "./DataPanel";
import { MarginPill } from "./MarginPill";

type MlbStatAnalysisTableProps = {
    loading: boolean;
    error: string | null;
    teams: TeamAnalysis[];
    modeFilter: DisplayMode;
    pillThreshold: number;
};

export function MlbStatAnalysisTable({
    loading,
    error,
    teams,
    modeFilter,
    pillThreshold,
}: MlbStatAnalysisTableProps) {
    const { t } = useTranslation("mlbStat");

    return (
        <section className="mlb-stat-panel mlb-stat-spaced">
            <div className="mlb-stat-section-head">
                <div>
                    <h2>{t("analysis.title")}</h2>
                    <div className="mlb-stat-note">{t("analysis.note")}</div>
                </div>
            </div>
            <div className="mlb-stat-table-wrap">
                <DataPanel
                    loading={loading}
                    error={error}
                    loadingLabel={t("loading")}
                    errorLabel={t("error.loadFailed", { error: error ?? "" })}
                    empty={teams.length === 0}
                    emptyLabel={t("noTeams")}
                >
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
                            {teams.map((team) => {
                                const targetRatio = marginRatio(
                                    team,
                                    modeFilter
                                );
                                return (
                                    <tr key={team.teamId}>
                                        <td>
                                            <strong>{team.teamName}</strong>
                                            <div className="mlb-stat-muted">
                                                {t("recentGames", {
                                                    count: team.recentCount,
                                                })}
                                            </div>
                                        </td>
                                        <td>{team.division}</td>
                                        <td>
                                            {team.winsSeason}-{team.lossesSeason}{" "}
                                            ({team.pct})
                                        </td>
                                        <td>
                                            {team.winOne}-{team.winTwo}-
                                            {team.winOver2}
                                        </td>
                                        <td>
                                            {(team.winRatio * 100).toFixed(1)}%
                                        </td>
                                        <td>
                                            {team.lossOne}-{team.lossTwo}-
                                            {team.lossOver2}
                                        </td>
                                        <td>
                                            {(team.lossRatio * 100).toFixed(1)}%
                                        </td>
                                        <td>
                                            <MarginPill
                                                ratio={targetRatio}
                                                threshold={pillThreshold}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </DataPanel>
            </div>
        </section>
    );
}
