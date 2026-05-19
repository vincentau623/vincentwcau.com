import { useTranslation } from "react-i18next";

type MlbStatSummaryProps = {
    gamesToday: number;
    teamsAnalyzed: number;
    highMarginCount: number;
};

export function MlbStatSummary({
    gamesToday,
    teamsAnalyzed,
    highMarginCount,
}: MlbStatSummaryProps) {
    const { t } = useTranslation("mlbStat");

    return (
        <section
            className="mlb-stat-grid"
            aria-label={t("a11y.summaryCards")}
        >
            <div className="mlb-stat-panel mlb-stat-stat">
                <div className="label">{t("stats.gamesToday")}</div>
                <div className="value">{gamesToday}</div>
            </div>
            <div className="mlb-stat-panel mlb-stat-stat">
                <div className="label">{t("stats.teamsAnalyzed")}</div>
                <div className="value">{teamsAnalyzed}</div>
            </div>
            <div className="mlb-stat-panel mlb-stat-stat">
                <div className="label">{t("stats.highMarginTeams")}</div>
                <div className="value">{highMarginCount}</div>
            </div>
        </section>
    );
}
