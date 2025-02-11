import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import CssBaseline from "@mui/material/CssBaseline";

import theme from "./theme";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
    <ThemeProvider theme={theme}>
        <StrictMode>
            <CssBaseline />
            <App />
        </StrictMode>
    </ThemeProvider>
);
