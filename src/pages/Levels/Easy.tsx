import "./Easy.css";

export default function Easy() {
    return (
        <main className="easy">
            <div className="game-box">

                <header className="nav">
                    <h1>Press & Regret: Easy</h1>
                </header>

                <div className="status">
                    <div className="level">Level 1</div>
                    <div className="timer">45</div>
                </div>

                <div className="center">
                    <button className="circle-button">
                        Test Level
                    </button>
                </div>

            </div>
        </main>
    );
}