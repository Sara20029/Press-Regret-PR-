import {Link} from "react-router-dom";

export default function Home() {
    return (
        <main className="home-page">
            <h1>Wähle eine Schwierigkeit</h1>
            <div className="home-buttons">
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