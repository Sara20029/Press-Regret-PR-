import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
    return (
        <main className="home-page" style={{ padding: 24}}>
            <h1 style={{color: "black"}}>Wähle eine Schwierigkeit</h1>
            <div style={{ display: "flex", gap: 12, marginTop: 16, color: "black"}}>
                <Link to="/game/easy">
                    <button>Easy</button>
                </Link>
                <Link to="/game/medium">
                    <button>Medium</button>
                </Link>
                <Link to="/game/hard">
                    <button>Hard</button>
                </Link>
            </div>
        </main>
    );
}