type MlbStatLogoProps = {
    label: string;
};

export function MlbStatLogo({ label }: MlbStatLogoProps) {
    return (
        <svg
            className="mlb-stat-logo"
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            aria-label={label}
        >
            <rect x="6" y="10" width="52" height="44" rx="10" />
            <path d="M18 42c7-16 21-25 28-20 6 5 1 18-12 24" />
            <circle cx="44" cy="24" r="4" fill="currentColor" stroke="none" />
        </svg>
    );
}
