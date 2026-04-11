import {Link} from "react-router-dom";
import {Trans, useTranslation} from 'react-i18next';
import "./Home.css";

export default function Home() {
    const { t } = useTranslation();

    return (
        <main className="home-page">
            <div className="home-logo-area">
                <img src="/favicon.svg" alt="Press & Regret logo" width="100" height="100"/>
                <h1 className="home-title">Press &amp; <span>Regret</span></h1>
                <p className="home-sub">{t('home.welcome')}</p>
            </div>

            <aside className="home-hint">
                <span className="home-hint-icon">💡</span>
                <span className="home-hint-text">
                    <Trans i18nKey="home.hint" components={[<span/>, <strong/>]} />
                </span>
            </aside>

            <section className="home-cards">
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
            </section>
        </main>
    );
}