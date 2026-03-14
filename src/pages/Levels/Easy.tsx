import "./Easy.css";

type EasyProps = {
    title: string;
    levelNumber: number;
    buttonText: string;
    timer: number;
};

export default function Easy({ title, levelNumber, timer, buttonText }: EasyProps) {
    return (
        <main className="easy">
            <div className="game-box">
                <header className="nav">
                    <h1>{title}</h1>
                </header>

                <div className="status">
                    <div className="level">Level {levelNumber}</div>
                    <div className="timer">{timer}</div>
                </div>

                <div className="center">
                    <button className="circle-button">
                        {buttonText}
                    </button>
                </div>
            </div>
        </main>
    );
}