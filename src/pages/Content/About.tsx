import { useEffect, useState } from "react";
import { api } from "../../api/http.ts";
import "./About.css";


type Content = { title: string; description: string };

export default function About() {
    const [data, setData] = useState<Content | null>(null);

    useEffect(() => {
        api.get<Content>("/api/content/about").then((r) => setData(r.data));
    }, []);

    if (!data) return <main>Lade…</main>;

    return (
        <main className="about-page">
            <h1>{data.title}</h1>
            <p>{data.description}</p>
        </main>
    );
}