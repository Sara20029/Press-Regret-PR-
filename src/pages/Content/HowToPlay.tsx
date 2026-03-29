import { useEffect, useState } from "react";
import { api } from "../../api/http.ts";
import "./HowToPlay.css";

type Content = {
    title: string;
    description: string;
    instructions: string[];
};

export default function HowToPlay() {
    const [data, setData] = useState<Content | null>(null);

    useEffect(() => {
        api.get<Content>("/api/content/how-to-play")
            .then((r) => {
                console.log("Response:", r.data);
                setData(r.data);
            })
            .catch((err) => console.error("API Fehler:", err));
    }, []);

    if (!data) {
        return <main style={{ padding: 24, color: "white" }}>Lade…</main>;
    }

    return (
        <main className="howToPlay-page" style={{ padding: 24, color: "white" }}>
            <h1 style={{color: "black"}}>{data.title}</h1>
            <p style={{color: "black"}}>{data.description}</p>

            <ul style={{ marginTop: 16, color: "black"}}>
                {data.instructions.map((instruction, index) => (
                    <li key={index} style={{ marginTop: 8 }}>
                        {instruction}
                    </li>
                ))}
            </ul>
        </main>
    );
}