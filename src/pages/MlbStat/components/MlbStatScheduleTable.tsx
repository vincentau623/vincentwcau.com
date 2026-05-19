import { useTranslation } from "react-i18next";
import type { ScheduleGame } from "../types";
import { DataPanel } from "./DataPanel";

type MlbStatScheduleTableProps = {
    loading: boolean;
    error: string | null;
    games: ScheduleGame[];
    dateLocale: string;
};

export function MlbStatScheduleTable({
    loading,
    error,
    games,
    dateLocale,
}: MlbStatScheduleTableProps) {
    const { t } = useTranslation("mlbStat");

    return (
        <section className="mlb-stat-panel mlb-stat-spaced">
            <div className="mlb-stat-section-head">
                <div>
                    <h2>{t("schedule.title")}</h2>
                    <div className="mlb-stat-note">{t("schedule.note")}</div>
                </div>
            </div>
            <div className="mlb-stat-table-wrap">
                <DataPanel
                    loading={loading}
                    error={error}
                    loadingLabel={t("loading")}
                    errorLabel={t("error.loadFailed", { error: error ?? "" })}
                    empty={games.length === 0}
                    emptyLabel={t("schedule.empty")}
                >
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
                            {games.map((g) => (
                                <tr key={g.gamePk}>
                                    <td>
                                        {g.away} @ {g.home}
                                    </td>
                                    <td>
                                        {new Date(g.gameDate).toLocaleString(
                                            dateLocale,
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                month: "2-digit",
                                                day: "2-digit",
                                            }
                                        )}
                                    </td>
                                    <td>{g.status}</td>
                                    <td>
                                        {g.awayScore ?? "-"} : {g.homeScore ?? "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </DataPanel>
            </div>
        </section>
    );
}
