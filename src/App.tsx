import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Game from "./pages/Game";
import About from "./pages/About";
import HowToPlay from "./pages/HowToPlay";

function Nav() {
    return (
        <nav style={{ display: "flex", gap: 12, padding: 16, borderBottom: "1px solid #ddd" }}>
            <Link to="/">Game</Link>
            <Link to="/how-to-play">How to play</Link>
            <Link to="/about">About</Link>
        </nav>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Nav />
            <Routes>
                <Route path="/" element={<Game />} />
                <Route path="/how-to-play" element={<HowToPlay />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}