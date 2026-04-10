import { useEffect, useState } from "react";
import { api } from "../../api/http.ts";
import "./Contact.css";
import { useTranslation } from 'react-i18next';



type Content = {
    title: string;
    description: string;
    email: string[];
};

export default function Contact() {
    const [data, setData] = useState<Content | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        api.get<Content>("/api/content/contact")
            .then((r) => {
                console.log("Response:", r.data);
                setData(r.data);
            })
            .catch((err) => console.error("API Fehler:", err));
    }, []);

    if (!data) {
        return <main>{t('game.loading')}…</main>;
    }

    return (
        <main className="contact-page">
            <h1>{data.title}</h1>
            <p>{data.description}</p>
            <p>{data.email}</p>
        </main>
    );
}