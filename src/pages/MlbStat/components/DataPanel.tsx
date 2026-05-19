import type { ReactNode } from "react";

type DataPanelProps = {
    loading: boolean;
    error: string | null;
    loadingLabel: string;
    errorLabel: string;
    empty?: boolean;
    emptyLabel?: string;
    children: ReactNode;
};

export function DataPanel({
    loading,
    error,
    loadingLabel,
    errorLabel,
    empty,
    emptyLabel,
    children,
}: DataPanelProps) {
    if (loading) {
        return <div className="mlb-stat-loading">{loadingLabel}</div>;
    }
    if (error) {
        return <div className="mlb-stat-error">{errorLabel}</div>;
    }
    if (empty && emptyLabel) {
        return <div className="mlb-stat-loading">{emptyLabel}</div>;
    }
    return <>{children}</>;
}
