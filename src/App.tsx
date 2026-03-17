import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Game from "./pages/Game";
import About from "./pages/About";
import HowToPlay from "./pages/HowToPlay";

function Nav() {
    return (
        <nav style={{ display: "flex", gap: 12, padding: 16, borderBottom: "1px solid #ddd" }}>
            <Link to="/game">Game</Link>
            <Link to="/game/easy">Game Easy</Link>
            <Link to="/game/medium">Game Medium</Link>
            <Link to="/game/hard">Game Hard</Link>
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
                <Route path="/game" element={<Game />} />
                <Route path="/game/easy" element={<Game />} />
                <Route path="/game/medium" element={<Game />} />
                <Route path="/game/hard" element={<Game />} />
                <Route path="/how-to-play" element={<HowToPlay />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}