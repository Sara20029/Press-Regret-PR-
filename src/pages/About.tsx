import { useEffect, useState } from "react";
import { api } from "../api/http";

type Section = { heading: string; body: string };
type Content = { slug: string; title: string; sections: Section[] };

export default function About() {
    const [data, setData] = useState<Content | null>(null);

    useEffect(() => {
        api.get<Content>("/api/content/about").then((r) => setData(r.data));
    }, []);

    if (!data) return <main style={{ padding: 24 }}>Lade…</main>;

    return (
        <main style={{ padding: 24 }}>
            <h1>{data.title}</h1>
            {data.sections.map((s, i) => (
                <section key={i} style={{ marginTop: 16 }}>
                    <h3>{s.heading}</h3>
                    <p>{s.body}</p>
                </section>
            ))}
        </main>
    );
}