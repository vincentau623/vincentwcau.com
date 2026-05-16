import { Container, Typography } from "@mui/material";
import "./App.css";
import Header from "./components/Header";
import { Route, BrowserRouter, Outlet, Routes } from "react-router";
import LuckyNumber from "./pages/LuckyNumber";
import Landing from "./pages/Landing";
import MlbStat from "./pages/MlbStat";

function SiteLayout() {
    return (
        <div className="app">
            <Header />
            <Container component="main" className="main-content">
                <Outlet />
            </Container>
            <footer className="footer">
                <Typography variant="body2">
                    &copy; 2025 Vincent Au. All rights reserved.
                </Typography>
            </footer>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<SiteLayout />}>
                    <Route path="/" element={<Landing />} />
                    <Route path="/lucky-number" element={<LuckyNumber />} />
                    <Route path="/mlb-stat" element={<MlbStat />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
