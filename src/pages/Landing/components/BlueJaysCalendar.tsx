import { useEffect, useMemo, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
    Box,
    Card,
    CardContent,
    Chip,
    IconButton,
    Link,
    Paper,
    Stack,
    Typography,
    alpha,
    useTheme,
} from "@mui/material";
import { gamedayUrl, type BlueJaysGame } from "../api/blueJays";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function gameDateKey(iso: string): string {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function dateKeyFromDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function shortOpponent(name: string): string {
    const parts = name.trim().split(/\s+/);
    return parts[parts.length - 1] || name;
}

function formatGameTime(iso: string): string {
    return new Date(iso).toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
    });
}

function formatFullDate(iso: string): string {
    return new Date(iso).toLocaleString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

function buildWeeks(year: number, month: number): (Date | null)[][] {
    const first = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0).getDate();
    const weeks: (Date | null)[][] = [];
    let week: (Date | null)[] = [];

    for (let i = 0; i < first.getDay(); i++) {
        week.push(null);
    }

    for (let day = 1; day <= lastDay; day++) {
        week.push(new Date(year, month, day));
        if (week.length === 7) {
            weeks.push(week);
            week = [];
        }
    }

    if (week.length > 0) {
        while (week.length < 7) week.push(null);
        weeks.push(week);
    }

    return weeks;
}

function groupByDate(games: BlueJaysGame[]): Map<string, BlueJaysGame[]> {
    const map = new Map<string, BlueJaysGame[]>();
    for (const g of games) {
        const key = gameDateKey(g.gameDate);
        const list = map.get(key) ?? [];
        list.push(g);
        map.set(key, list);
    }
    return map;
}

type GamePillProps = {
    game: BlueJaysGame;
    selected: boolean;
    onSelect: () => void;
};

function GamePill({ game, selected, onSelect }: GamePillProps) {
    const theme = useTheme();
    const isFinal = game.status === "Final";
    const prefix = game.isHome ? "vs" : "@";
    const opp = shortOpponent(game.opponent);

    let bg = alpha(theme.palette.primary.main, 0.12);
    let borderColor = theme.palette.primary.main;

    if (isFinal && game.won === true) {
        bg = alpha(theme.palette.success.main, 0.2);
        borderColor = theme.palette.success.main;
    } else if (isFinal && game.won === false) {
        bg = alpha(theme.palette.error.main, 0.18);
        borderColor = theme.palette.error.main;
    }

    const label = isFinal
        ? `${prefix} ${opp} ${game.jaysScore}–${game.oppScore}`
        : `${prefix} ${opp} ${game.opponentRecord ? `(${game.opponentRecord})` : ""}`;

    return (
        <Box
            component="button"
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
            sx={{
                display: "block",
                width: "100%",
                textAlign: "left",
                border: "1px solid",
                borderColor: selected ? theme.palette.secondary.main : borderColor,
                borderRadius: 1,
                bgcolor: bg,
                px: 0.5,
                py: 0.25,
                mb: 0.25,
                cursor: "pointer",
                font: "inherit",
                fontSize: "0.65rem",
                lineHeight: 1.25,
                color: "text.primary",
                outline: selected ? `2px solid ${theme.palette.secondary.main}` : "none",
                "&:hover": { filter: "brightness(0.95)" },
            }}
        >
            {label}
            {!isFinal && (
                <Box component="span" sx={{ display: "block", opacity: 0.75 }}>
                    {formatGameTime(game.gameDate)}
                </Box>
            )}
        </Box>
    );
}

type BlueJaysCalendarProps = {
    upcoming: BlueJaysGame[];
    recent: BlueJaysGame[];
};

const BlueJaysCalendar = ({ upcoming, recent }: BlueJaysCalendarProps) => {
    const theme = useTheme();
    const allGames = useMemo(
        () => [...recent, ...upcoming],
        [recent, upcoming]
    );
    const byDate = useMemo(() => groupByDate(allGames), [allGames]);

    const initialMonth = useMemo(() => {
        const next = upcoming[0];
        if (next) return new Date(next.gameDate);
        const last = recent[0];
        if (last) return new Date(last.gameDate);
        return new Date();
    }, [upcoming, recent]);

    const [viewDate, setViewDate] = useState(
        () => new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1)
    );
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [monthSynced, setMonthSynced] = useState(false);

    useEffect(() => {
        if (monthSynced || allGames.length === 0) return;
        const anchor = upcoming[0] ?? recent[0];
        if (!anchor) return;
        const d = new Date(anchor.gameDate);
        setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
        setMonthSynced(true);
    }, [allGames.length, upcoming, recent, monthSynced]);

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const weeks = useMemo(() => buildWeeks(year, month), [year, month]);
    const monthLabel = viewDate.toLocaleString(undefined, {
        month: "long",
        year: "numeric",
    });

    const todayKey = dateKeyFromDate(new Date());
    const selectedGames = selectedKey ? (byDate.get(selectedKey) ?? []) : [];

    const shiftMonth = (delta: number) => {
        setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1));
        setSelectedKey(null);
    };

    if (allGames.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary">
                No games to show on the calendar.
            </Typography>
        );
    }

    return (
        <Stack spacing={2}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                gap={1}
            >
                <Stack direction="row" alignItems="center" spacing={0.5}>
                    <IconButton
                        size="small"
                        aria-label="Previous month"
                        onClick={() => shiftMonth(-1)}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                    <Typography variant="subtitle1" fontWeight={700} minWidth={160} textAlign="center">
                        {monthLabel}
                    </Typography>
                    <IconButton
                        size="small"
                        aria-label="Next month"
                        onClick={() => shiftMonth(1)}
                    >
                        <ChevronRightIcon />
                    </IconButton>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip size="small" label="Win" sx={{ bgcolor: alpha(theme.palette.success.main, 0.2) }} />
                    <Chip size="small" label="Loss" sx={{ bgcolor: alpha(theme.palette.error.main, 0.18) }} />
                    <Chip size="small" label="Upcoming" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.12) }} />
                </Stack>
            </Stack>

            <Paper variant="outlined" sx={{ overflow: "hidden" }}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, 1fr)",
                        bgcolor: alpha(theme.palette.primary.main, 0.06),
                        borderBottom: 1,
                        borderColor: "divider",
                    }}
                >
                    {WEEKDAYS.map((day) => (
                        <Typography
                            key={day}
                            variant="caption"
                            fontWeight={700}
                            textAlign="center"
                            py={1}
                            sx={{ color: "text.secondary" }}
                        >
                            {day}
                        </Typography>
                    ))}
                </Box>

                {weeks.map((week, wi) => (
                    <Box
                        key={wi}
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(7, 1fr)",
                            borderBottom: wi < weeks.length - 1 ? 1 : 0,
                            borderColor: "divider",
                        }}
                    >
                        {week.map((day, di) => {
                            if (!day) {
                                return (
                                    <Box
                                        key={di}
                                        sx={{
                                            minHeight: { xs: 72, sm: 96 },
                                            bgcolor: alpha(theme.palette.action.hover, 0.04),
                                            borderRight: di < 6 ? 1 : 0,
                                            borderColor: "divider",
                                        }}
                                    />
                                );
                            }

                            const key = dateKeyFromDate(day);
                            const dayGames = byDate.get(key) ?? [];
                            const isToday = key === todayKey;
                            const isSelected = key === selectedKey;

                            return (
                                <Box
                                    key={di}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() =>
                                        setSelectedKey(
                                            dayGames.length > 0 ? key : null
                                        )
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            setSelectedKey(
                                                dayGames.length > 0 ? key : null
                                            );
                                        }
                                    }}
                                    sx={{
                                        minHeight: { xs: 72, sm: 96 },
                                        p: 0.5,
                                        borderRight: di < 6 ? 1 : 0,
                                        borderColor: "divider",
                                        cursor: dayGames.length > 0 ? "pointer" : "default",
                                        bgcolor: isSelected
                                            ? alpha(theme.palette.secondary.main, 0.12)
                                            : isToday
                                                ? alpha(theme.palette.primary.main, 0.08)
                                                : "background.paper",
                                        outline: isToday
                                            ? `2px solid ${theme.palette.primary.main}`
                                            : "none",
                                        outlineOffset: -2,
                                        "&:hover": dayGames.length > 0
                                            ? { bgcolor: alpha(theme.palette.action.hover, 0.08) }
                                            : undefined,
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        fontWeight={isToday ? 700 : 500}
                                        color={isToday ? "primary" : "text.secondary"}
                                    >
                                        {day.getDate()}
                                    </Typography>
                                    {dayGames.map((game) => (
                                        <GamePill
                                            key={game.gamePk}
                                            game={game}
                                            selected={isSelected}
                                            onSelect={() => setSelectedKey(key)}
                                        />
                                    ))}
                                </Box>
                            );
                        })}
                    </Box>
                ))}
            </Paper>

            {selectedGames.length > 0 && (
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="subtitle2" gutterBottom color="text.secondary">
                            {formatFullDate(selectedGames[0].gameDate)}
                        </Typography>
                        <Stack spacing={1.5}>
                            {selectedGames.map((game) => {
                                const isFinal = game.status === "Final";
                                const at = game.isHome ? "vs" : "@";
                                return (
                                    <Stack key={game.gamePk} spacing={0.5}>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            flexWrap="wrap"
                                            gap={1}
                                        >
                                            <Typography variant="body1" fontWeight={600}>
                                                {at} {game.opponent} {game.opponentRecord ? `(${game.opponentRecord})` : ""}
                                            </Typography>
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                            >
                                                {isFinal && game.jaysScore != null && (
                                                    <Typography variant="body2">
                                                        {game.jaysScore}–{game.oppScore}
                                                    </Typography>
                                                )}
                                                {isFinal && game.won !== undefined && (
                                                    <Chip
                                                        label={game.won ? "Win" : "Loss"}
                                                        size="small"
                                                        color={
                                                            game.won ? "success" : "error"
                                                        }
                                                    />
                                                )}
                                                {!isFinal && (
                                                    <Chip
                                                        label={game.status}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                )}
                                            </Stack>
                                        </Stack>
                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            flexWrap="wrap"
                                            alignItems="center"
                                        >
                                            <Link
                                                href={gamedayUrl(game.gamePk)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                variant="caption"
                                                sx={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: 0.25,
                                                }}
                                            >
                                                Gameday
                                                <OpenInNewIcon sx={{ fontSize: 12 }} />
                                            </Link>
                                        </Stack>
                                    </Stack>
                                );
                            })}
                        </Stack>
                    </CardContent>
                </Card>
            )}
        </Stack>
    );
};

export default BlueJaysCalendar;
