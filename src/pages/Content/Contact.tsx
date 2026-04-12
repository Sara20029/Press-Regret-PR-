import {useEffect, useState} from "react";
import {api} from "../../api/http.ts";
import "./Contact.css";
import {useTranslation} from 'react-i18next';

// Shape of the contact returned by the backend
type Content = {
    title: string;
    description: string;
    email: string;
};

/**
 * Contact page showing team email adresses fetched from the backend
 * Splits the comma-separated email string into individual clickable cards
 */
export default function Contact() {
    const [data, setData] = useState<Content | null>(null);
    const {t} = useTranslation();

    useEffect(() => {
        api.get<Content>("/api/content/contact")
            .then((r) => setData(r.data))
            .catch((err) => console.error("API Fehler:", err));
    }, []);

    if (!data) return <main>{t('game.loading')}…</main>;

    const emails = data.email.split(",").map((e: string) => e.trim());

    return (
        <main className="contact-page">
            <div className="contact-box">
                <div className="contact-header">
                    <span className="contact-icon">✉️</span>
                    <h1 className="contact-title">{t(data.title)}</h1>
                    <p className="contact-desc">{t(data.description)}</p>
                </div>

                <section className="contact-email-section">
                    <p className="contact-email-label">{t('contact.emailLabel')}</p>
                    {/* Each email renders as a clickable mailto card*/}
                    <div className="contact-emails">
                        {emails.map((email: string, index: number) => (

                            <a key={index}
                                href={"mailto:" + email}
                                className="contact-email-card"
                            >
                            <span className="contact-email-avatar">
                                {email[0].toUpperCase()}
                            </span>
                                <span className="contact-email-address">{email}</span>
                            </a>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    )
        ;
}