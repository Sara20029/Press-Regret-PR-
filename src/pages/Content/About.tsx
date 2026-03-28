import { useEffect, useState } from "react";
import { api } from "../../api/http.ts";


type Content = { title: string; description: string };

export default function About() {
    const [data, setData] = useState<Content | null>(null);

    useEffect(() => {
        api.get<Content>("/api/content/about").then((r) => setData(r.data));
    }, []);

    if (!data) return <main style={{ padding: 24 }}>Lade…</main>;

    return (
        <main style={{ padding: 24, color: "white" }}>
            <h1>{data.title}</h1>
            <p>{data.description}</p>
        </main>
    );
}