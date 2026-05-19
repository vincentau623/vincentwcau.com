import { useTranslation } from "react-i18next";

type MlbStatHeroProps = {
    statusText: string;
};

export function MlbStatHero({ statusText }: MlbStatHeroProps) {
    const { t } = useTranslation("mlbStat");

    return (
        <section className="mlb-stat-hero">
            <article className="mlb-stat-panel mlb-stat-hero-card">
                <div className="mlb-stat-muted">{t("hero.purposeLabel")}</div>
                <p>{t("hero.purposeText")}</p>
            </article>
            <aside className="mlb-stat-panel mlb-stat-hero-card">
                <div className="mlb-stat-muted">{t("hero.statusLabel")}</div>
                <div>{statusText}</div>
                <div className="mlb-stat-muted" style={{ marginTop: "1rem" }}>
                    {t("hero.statusNote")}
                </div>
            </aside>
        </section>
    );
}


