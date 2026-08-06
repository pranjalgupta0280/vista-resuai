import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useInterview } from '../hooks/useInterview.js';
import Navbar from '../../../components/Navbar.jsx';
import DailyCoachWidget from '../../../components/DailyCoachWidget.jsx';
import '../styles/dailyCoachPage.scss';

const DailyCoachPage = () => {
    const { reports } = useInterview();
    const navigate = useNavigate();

    // Calculate Quick Stats
    const totalPlans = reports.length;
    const topScore = useMemo(() => {
        if (!reports.length) return 0;
        return Math.max(...reports.map(r => r.matchScore || 0));
    }, [reports]);

    const avgScore = useMemo(() => {
        if (!reports.length) return 0;
        const sum = reports.reduce((acc, curr) => acc + (curr.matchScore || 0), 0);
        return Math.round(sum / reports.length);
    }, [reports]);

    return (
        <div className="daily-coach-page-wrapper">
            <Navbar />

            <div className="coach-page-container">
                {/* Hero Header */}
                <header className="page-header">
                    <div className="hero-badge">✨ AI DAILY INTERVIEW COACH</div>
                    <h1>Your Daily <span className="highlight">Preparation Dashboard</span></h1>
                    <p>Track your daily interview sprint, maintain your practice streak, and monitor overall ATS fit scores.</p>
                </header>

                {/* Personalized Daily Coach Widget */}
                <DailyCoachWidget />

                {/* Quick Metric Stats */}
                <section className="stats-bar">
                    <div className="stat-card glass-card">
                        <div className="stat-icon cyan">📊</div>
                        <div className="stat-info">
                            <span className="stat-value">{totalPlans}</span>
                            <span className="stat-label">Total Plans Created</span>
                        </div>
                    </div>
                    <div className="stat-card glass-card">
                        <div className="stat-icon purple">🏆</div>
                        <div className="stat-info">
                            <span className="stat-value">{topScore > 0 ? `${topScore}%` : 'N/A'}</span>
                            <span className="stat-label">Highest Match Score</span>
                        </div>
                    </div>
                    <div className="stat-card glass-card">
                        <div className="stat-icon emerald">⚡</div>
                        <div className="stat-info">
                            <span className="stat-value">{avgScore > 0 ? `${avgScore}%` : 'N/A'}</span>
                            <span className="stat-label">Average Fit Score</span>
                        </div>
                    </div>
                </section>

                {/* Direct Action Banner */}
                <div className="cta-banner glass-card">
                    <div className="cta-content">
                        <h3>Ready to prepare for a new job opportunity?</h3>
                        <p>Generate a tailored interview strategy complete with technical questions, STAR answers, and skill gap roadmaps.</p>
                    </div>
                    <button className="cta-btn" onClick={() => navigate('/create')}>
                        ⚡ Create New Strategy →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DailyCoachPage;
