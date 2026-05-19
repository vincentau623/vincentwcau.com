import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enMlbStat from "./locales/en/mlbStat.json";
import zhHantMlbStat from "./locales/zh-Hant/mlbStat.json";

const STORAGE_KEY = "i18nextLng";

function detectLanguage(): string {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "zh-Hant") return stored;
    return navigator.language.toLowerCase().startsWith("zh")
        ? "zh-Hant"
        : "en";
}

void i18n.use(initReactI18next).init({
    resources: {
        en: { mlbStat: enMlbStat },
        "zh-Hant": { mlbStat: zhHantMlbStat },
    },
    lng: detectLanguage(),
    fallbackLng: "zh-Hant",
    defaultNS: "mlbStat",
    interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
    localStorage.setItem(STORAGE_KEY, lng);
    document.documentElement.lang = lng;
});

document.documentElement.lang = i18n.language;

export default i18n;
