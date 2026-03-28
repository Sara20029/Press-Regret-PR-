import "./Profile.css";

export default function Profile() {
    const user = {
        name: "Sara Sabra",
        username: "@sara24",
        email: "sara@example.com",
        bio: "Informatikstudentin mit Interesse an Webentwicklung, Apps und kreativen Projekten.",
        level: 12,
        points: 2480,
        achievements: 18,
        profileImage:
            "https://via.placeholder.com/140",
    };

    return (
        <div className="profile-page">
            <div className="profile-card">
                <div className="profile-header">
                    <img
                        src={user.profileImage}
                        alt="Profilbild"
                        className="profile-avatar"
                    />

                    <div className="profile-user-info">
                        <h1>{user.name}</h1>
                        <p className="profile-username">{user.username}</p>
                        <p className="profile-email">{user.email}</p>
                    </div>
                </div>

                <div className="profile-section">
                    <h2>Über mich</h2>
                    <p>{user.bio}</p>
                </div>

                <div className="profile-section">
                    <h2>Statistiken</h2>
                    <div className="profile-stats">
                        <div className="stat-box">
                            <span className="stat-value">{user.level}</span>
                            <span className="stat-label">Level</span>
                        </div>

                        <div className="stat-box">
                            <span className="stat-value">{user.points}</span>
                            <span className="stat-label">Punkte</span>
                        </div>

                        <div className="stat-box">
                            <span className="stat-value">{user.achievements}</span>
                            <span className="stat-label">Erfolge</span>
                        </div>
                    </div>
                </div>

                <div className="profile-section">
                    <h2>Konto</h2>
                    <div className="profile-actions">
                        <button className="edit-btn">Profil bearbeiten</button>
                        <button className="logout-btn">Abmelden</button>
                    </div>
                </div>
            </div>
        </div>
    );
}