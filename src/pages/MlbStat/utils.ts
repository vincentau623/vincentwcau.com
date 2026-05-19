/** Maps i18n language codes to BCP 47 locales used by Intl/date formatters. */
export function localeForLanguage(lng: string): string {
    return lng === "zh-Hant" ? "zh-TW" : "en-US";
}

export function dateStr(d = new Date()): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}
