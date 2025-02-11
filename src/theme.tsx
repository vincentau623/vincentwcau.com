import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
    cssVariables: true,
    palette: {
        primary: {
            main: "#4056A1",
        },
        secondary: {
            main: "#D79922",
        },
        error: {
            main: "#F13C20",
        },
    },
});

export default theme;
