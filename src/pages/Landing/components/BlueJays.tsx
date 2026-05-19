import { useCallback, useEffect, useState } from "react";
import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    Link,
    Stack,
    Typography,
} from "@mui/material";
import {
    getBlueJaysGames,
    getBlueJaysStanding,
    type BlueJaysStanding,
} from "../api/blueJays";
import BlueJaysCalendar from "./BlueJaysCalendar";

const BlueJays = () => {
    const [standing, setStanding] = useState<BlueJaysStanding | null>(null);
    const [upcoming, setUpcoming] = useState<
        Awaited<ReturnType<typeof getBlueJaysGames>>["upcoming"]
    >([]);
    const [recent, setRecent] = useState<
        Awaited<ReturnType<typeof getBlueJaysGames>>["recent"]
    >([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [record, games] = await Promise.all([
                getBlueJaysStanding(),
                getBlueJaysGames(),
            ]);
            setStanding(record);
            setUpcoming(games.upcoming);
            setRecent(games.recent);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Failed to load data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={3}>
                <CircularProgress size={32} />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert
                severity="error"
                action={
                    <Link
                        component="button"
                        variant="body2"
                        onClick={() => void load()}
                    >
                        Retry
                    </Link>
                }
            >
                Could not load Blue Jays data: {error}
            </Alert>
        );
    }

    return (
        <Stack spacing={3}>
            {standing && (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip
                        label={`${standing.wins}-${standing.losses}`}
                        color="primary"
                    />
                    <Chip label={`Remaining: ${upcoming.length} Games`} variant="outlined" />
                    <Chip label={`${standing.pct} PCT`} variant="outlined" />
                </Stack>
            )}

            <BlueJaysCalendar upcoming={upcoming} recent={recent} />

            <Typography variant="caption" color="text.secondary">
                Data from{" "}
                <Link
                    href="https://statsapi.mlb.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    MLB Stats API
                </Link>
                . Tap a game day for details. Use arrows to change month.
            </Typography>
        </Stack>
    );
};

export default BlueJays;
