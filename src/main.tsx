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
import { PostHogProvider } from "posthog-js/react";

createRoot(document.getElementById("root")!).render(
    <ThemeProvider theme={theme}>
        <StrictMode>
            <CssBaseline />
            <PostHogProvider
                apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
                options={{
                    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
                    defaults: "2025-05-24",
                }}
            >
                <App />
            </PostHogProvider>
        </StrictMode>
    </ThemeProvider>
);
