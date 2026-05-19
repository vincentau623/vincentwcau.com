import { useTranslation } from "react-i18next";

type MarginPillProps = {
    ratio: number;
    threshold: number;
};

/** Verdict badge: high (≥ threshold), low (≤ 45%), or neutral between. */
export function MarginPill({ ratio, threshold }: MarginPillProps) {
    const { t } = useTranslation("mlbStat");
    if (ratio >= threshold) {
        return <span className="mlb-stat-pill good">{t("pill.high")}</span>;
    }
    if (ratio <= 0.45) {
        return <span className="mlb-stat-pill bad">{t("pill.low")}</span>;
    }
    return <span className="mlb-stat-pill neutral">{t("pill.neutral")}</span>;
}
