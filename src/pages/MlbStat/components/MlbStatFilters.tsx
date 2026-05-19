import { useTranslation } from "react-i18next";
import type { DisplayMode } from "../types";

type MlbStatFiltersProps = {
    divisions: string[];
    teamFilter: string;
    divisionFilter: string;
    thresholdFilter: string;
    modeFilter: DisplayMode;
    onTeamFilterChange: (value: string) => void;
    onDivisionFilterChange: (value: string) => void;
    onThresholdFilterChange: (value: string) => void;
    onModeFilterChange: (mode: DisplayMode) => void;
};

export function MlbStatFilters({
    divisions,
    teamFilter,
    divisionFilter,
    thresholdFilter,
    modeFilter,
    onTeamFilterChange,
    onDivisionFilterChange,
    onThresholdFilterChange,
    onModeFilterChange,
}: MlbStatFiltersProps) {
    const { t } = useTranslation("mlbStat");

    return (
        <section className="mlb-stat-panel" aria-labelledby="controls-title">
            <div className="mlb-stat-section-head">
                <div>
                    <h2 id="controls-title">{t("filters.title")}</h2>
                    <div className="mlb-stat-note">{t("filters.note")}</div>
                </div>
            </div>
            <div className="mlb-stat-controls">
                <div>
                    <label htmlFor="teamFilter">{t("filters.teamSearch")}</label>
                    <input
                        id="teamFilter"
                        type="text"
                        placeholder={t("filters.teamPlaceholder")}
                        value={teamFilter}
                        onChange={(e) => onTeamFilterChange(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="divisionFilter">{t("filters.division")}</label>
                    <select
                        id="divisionFilter"
                        value={divisionFilter}
                        onChange={(e) => onDivisionFilterChange(e.target.value)}
                    >
                        <option value="">{t("filters.all")}</option>
                        {divisions.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="thresholdFilter">{t("filters.threshold")}</label>
                    <select
                        id="thresholdFilter"
                        value={thresholdFilter}
                        onChange={(e) => onThresholdFilterChange(e.target.value)}
                    >
                        <option value="all">{t("filters.thresholdAll")}</option>
                        <option value="0.55">55%</option>
                        <option value="0.66">66%</option>
                        <option value="0.7">70%</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="modeFilter">{t("filters.displayMode")}</label>
                    <select
                        id="modeFilter"
                        value={modeFilter}
                        onChange={(e) =>
                            onModeFilterChange(e.target.value as DisplayMode)
                        }
                    >
                        <option value="all">{t("filters.all")}</option>
                        <option value="wins">{t("filters.winsOnly")}</option>
                        <option value="losses">{t("filters.lossesOnly")}</option>
                    </select>
                </div>
            </div>
        </section>
    );
}
