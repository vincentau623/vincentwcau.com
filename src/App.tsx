import { Container, Typography } from "@mui/material";
import "./App.css";
import Header from "./components/Header";
import { Route, BrowserRouter, Routes } from "react-router";
import LuckyNumber from "./pages/LuckyNumber";
import Landing from "./pages/Landing";

function App() {
    return (
        <div className="app">
            <Header />
            <Container component="main" className="main-content">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/lucky-number" element={<LuckyNumber />} />
                    </Routes>
                </BrowserRouter>
            </Container>
            <footer className="footer">
                <Typography variant="body2">
                    &copy; 2025 Vincent Au. All rights reserved.
                </Typography>
            </footer>
        </div>
    );
}

export default App;
