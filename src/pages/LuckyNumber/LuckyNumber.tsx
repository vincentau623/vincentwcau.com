import {
    Box,
    Button,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";

const LuckyNumber = () => {
    const [minNumber, setMinNumber] = useState(1);
    const [maxNumber, setMaxNumber] = useState(49);
    const [numbersInSet, setNumbersInSet] = useState(6);
    const [generatedNumbers, setGeneratedNumbers] = useState<string[]>([]);

    const handlePreset = (min: number, max: number, set: number) => () => {
        setMinNumber(min);
        setMaxNumber(max);
        setNumbersInSet(set);
    };

    const handleGenerateNumber = () => {
        // Generate random numbers
        const randomNumbersSet = new Set<number>();
        while (randomNumbersSet.size < numbersInSet) {
            randomNumbersSet.add(
                Math.floor(Math.random() * (maxNumber - minNumber + 1)) +
                    minNumber
            );
        }

        const numberString = [...randomNumbersSet]
            .sort((a, b) => a - b)
            .map((el) => " " + ("0" + el).slice(-2) + " ")
            .toString();
        setGeneratedNumbers([...generatedNumbers, numberString]);
    };

    return (
        <>
            <Box
                component="section"
                id="home"
                style={{ padding: 4, marginTop: 16 }}
            >
                <Paper sx={{ padding: 2, flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        Lucky Number Generator
                    </Typography>
                    <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                        <Grid size={4}>
                            <TextField
                                label="Min Number"
                                variant="outlined"
                                value={minNumber}
                                onChange={(e) => setMinNumber(+e.target.value)}
                            ></TextField>
                        </Grid>
                        <Grid size={4}>
                            <TextField
                                label="Max Number"
                                variant="outlined"
                                value={maxNumber}
                                onChange={(e) => setMaxNumber(+e.target.value)}
                            ></TextField>
                        </Grid>
                        <Grid size={4}>
                            <TextField
                                label="Numbers in Set"
                                variant="outlined"
                                value={numbersInSet}
                                onChange={(e) =>
                                    setNumbersInSet(+e.target.value)
                                }
                            ></TextField>
                        </Grid>
                    </Grid>
                    <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
                        <div>Presets:</div>
                        <Button
                            variant="contained"
                            onClick={handlePreset(1, 50, 7)}
                            size="small"
                        >
                            LottoMax
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handlePreset(1, 49, 6)}
                            size="small"
                        >
                            649
                        </Button>
                    </Stack>

                    <Button variant="contained" onClick={handleGenerateNumber}>
                        Generate
                    </Button>
                </Paper>
                {generatedNumbers.length > 0 && (
                    <Paper sx={{ padding: 2, marginTop: 2 }}>
                        <Typography variant="h6">Generated Numbers</Typography>

                        <ol className="result">
                            {generatedNumbers.map((el, index) => (
                                <li key={index}>
                                    {el}
                                    <Button
                                        variant="contained"
                                        size="small"
                                        color="error"
                                        onClick={() => {
                                            setGeneratedNumbers(
                                                generatedNumbers.filter(
                                                    (_, itemIndex) =>
                                                        itemIndex !== index
                                                )
                                            );
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </li>
                            ))}
                        </ol>

                        <Button
                            variant="contained"
                            size="small"
                            color="error"
                            onClick={() => {
                                setGeneratedNumbers([]);
                            }}
                        >
                            Clear
                        </Button>
                    </Paper>
                )}
            </Box>
        </>
    );
};

export default LuckyNumber;
