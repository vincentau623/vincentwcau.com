import { useTranslation } from "react-i18next";
import type { Theme } from "../types";
import { MlbStatLogo } from "./MlbStatLogo";

type MlbStatHeaderProps = {
    theme: Theme;
    loading: boolean;
    onToggleTheme: () => void;
    onRefresh: () => void;
};

export function MlbStatHeader({
    theme,
    loading,
    onToggleTheme,
    onRefresh,
}: MlbStatHeaderProps) {
    const { t, i18n } = useTranslation("mlbStat");

    return (
        <header className="mlb-stat-header">
            <div className="mlb-stat-brand">
                <MlbStatLogo label={t("a11y.logo")} />
                <div>
                    <h1>{t("title")}</h1>
                    <div className="mlb-stat-muted">{t("subtitle")}</div>
                </div>
            </div>
            <div className="mlb-stat-top-actions">
                <a className="mlb-stat-btn" href="/">
                    {t("nav.home")}
                </a>
                <select
                    className="mlb-stat-btn mlb-stat-lang"
                    value={i18n.language}
                    onChange={(e) => void i18n.changeLanguage(e.target.value)}
                    aria-label={t("lang.switch")}
                >
                    <option value="zh-Hant">{t("lang.zhHant")}</option>
                    <option value="en">{t("lang.en")}</option>
                </select>
                <button
                    type="button"
                    className="mlb-stat-btn"
                    onClick={onToggleTheme}
                    aria-label={t("a11y.toggleTheme")}
                >
                    {theme === "dark" ? "\u2600\ufe0f" : "\ud83c\udf19"}
                </button>
                <button
                    type="button"
                    className="mlb-stat-btn primary"
                    onClick={onRefresh}
                    disabled={loading}
                >
                    {t("actions.refresh")}
                </button>
            </div>
        </header>
    );
}
