import { useEffect, useState } from "react";
import type { Theme } from "../types";

export function useMlbStatTheme() {
    const [theme, setTheme] = useState<Theme>(() =>
        matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    );

    useEffect(() => {
        document.documentElement.classList.add("mlb-stat-page");
        return () => {
            document.documentElement.classList.remove("mlb-stat-page");
            delete document.documentElement.dataset.mlbTheme;
        };
    }, []);

    useEffect(() => {
        document.documentElement.dataset.mlbTheme = theme;
    }, [theme]);

    const toggleTheme = () =>
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));

    return { theme, toggleTheme };
}
