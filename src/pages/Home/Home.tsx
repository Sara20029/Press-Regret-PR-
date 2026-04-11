import {Link} from "react-router-dom";
import {Trans, useTranslation} from 'react-i18next';
import "./Home.css";

export default function Home() {
    const { t } = useTranslation();

    return (
        <main className="home-page">
            <div className="home-logo-area">
                <svg width="100" height="100" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="80" height="80" rx="20" fill="#1a1a1a"/>
                    <circle cx="40" cy="38" r="22" fill="none" stroke="#e05555" strokeWidth="3"/>
                    <polygon points="33,28 33,50 54,39" fill="#ffffff"/>
                    <path d="M58 56 Q66 48 62 58 Q58 68 50 64" stroke="#e05555" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <circle cx="56" cy="62" r="3" fill="#e05555"/>
                </svg>
                <h1 className="home-title">Press &amp; <span>Regret</span></h1>
                <p className="home-sub">{t('home.welcome')}</p>
            </div>

            <div className="home-hint">
                <span className="home-hint-icon">💡</span>
                <span className="home-hint-text">
                    <Trans i18nKey="home.hint" components={[<span/>, <strong/>]} />
                </span>
            </div>

            <div className="home-cards">
                <Link to="/game/easy" className="home-card home-card-easy">
                    <span className="home-card-badge">{t('home.recommended')}</span>
                    <span className="home-card-icon">🟢</span>
                    <span className="home-card-title">{t('nav.easy')}</span>
                    <span className="home-card-desc">{t('home.easyDesc')}</span>
                </Link>
                <Link to="/game/medium" className="home-card home-card-medium">
                    <span className="home-card-icon">🟠</span>
                    <span className="home-card-title">{t('nav.medium')}</span>
                    <span className="home-card-desc">{t('home.mediumDesc')}</span>
                </Link>
                <Link to="/game/hard" className="home-card home-card-hard">
                    <span className="home-card-icon">🔴</span>
                    <span className="home-card-title">{t('nav.hard')}</span>
                    <span className="home-card-desc">{t('home.hardDesc')}</span>
                </Link>
            </div>
        </main>
    );
}