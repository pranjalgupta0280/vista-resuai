import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useInterview } from '../hooks/useInterview.js';
import Navbar from '../../../components/Navbar.jsx';
import '../styles/home.scss';

const ITEMS_PER_PAGE = 4;

const Home = () => {
    const { loading, generateReport, reports } = useInterview();
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [fileName, setFileName] = useState("");
    const resumeInputRef = useRef();
    const navigate = useNavigate();

    // Search, Filter & Pagination states
    const [searchQuery, setSearchQuery] = useState("");
    const [scoreFilter, setScoreFilter] = useState("all"); // 'all', 'high', 'mid', 'low'
    const [currentPage, setCurrentPage] = useState(1);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
        } else {
            setFileName("");
        }
    };

    const handleGenerateReport = async () => {
        setErrorMessage(null);
        const resumeFile = resumeInputRef.current?.files[0];

        if (!jobDescription.trim()) {
            setErrorMessage("Please enter a Target Job Description.");
            return;
        }

        if (!resumeFile && !selfDescription.trim()) {
            setErrorMessage("Please upload a Resume or provide a Quick Self-Description.");
            return;
        }

        try {
            const data = await generateReport({ jobDescription, selfDescription, resumeFile });
            if (data && data._id) {
                navigate(`/interview/${data._id}`);
            }
        } catch (error) {
            console.error("Failed to generate report:", error);
            setErrorMessage("The AI model is currently experiencing high demand. Please try again in a few seconds.");
        }
    };

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

    // Filter & Search Logic
    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            const matchesQuery = (report.title || 'Untitled Position')
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            
            const score = report.matchScore || 0;
            let matchesScore = true;
            if (scoreFilter === 'high') matchesScore = score >= 80;
            else if (scoreFilter === 'mid') matchesScore = score >= 60 && score < 80;
            else if (scoreFilter === 'low') matchesScore = score < 60;

            return matchesQuery && matchesScore;
        });
    }, [reports, searchQuery, scoreFilter]);

    // Pagination Logic
    const totalPages = Math.max(1, Math.ceil(filteredReports.length / ITEMS_PER_PAGE));
    const paginatedReports = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredReports.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredReports, currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading) {
        return (
            <div className="home-page-wrapper">
                <Navbar />
                <main className="loading-screen">
                    <div className="spinner-glow"></div>
                    <h1>Generating Your AI Interview Strategy...</h1>
                    <p>Analyzing job requirements &amp; extracting profile insights. This usually takes ~30 seconds.</p>
                </main>
            </div>
        );
    }

    return (
        <div className="home-page-wrapper">
            <Navbar />

            <div className="home-container">
                {/* Hero Header */}
                <header className="page-header">
                    <div className="hero-badge">✨ AI-POWERED INTERVIEW COACH</div>
                    <h1>Create Your Custom <span className="highlight">Interview Strategy</span></h1>
                    <p>Upload your resume and paste job details to receive personalized interview questions, skill gap analysis, and prep strategies.</p>
                </header>

                {/* Quick Metric Stats */}
                <section className="stats-bar">
                    <div className="stat-card">
                        <div className="stat-icon cyan">📊</div>
                        <div className="stat-info">
                            <span className="stat-value">{totalPlans}</span>
                            <span className="stat-label">Total Plans Created</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon purple">🏆</div>
                        <div className="stat-info">
                            <span className="stat-value">{topScore > 0 ? `${topScore}%` : 'N/A'}</span>
                            <span className="stat-label">Highest Match Score</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon emerald">⚡</div>
                        <div className="stat-info">
                            <span className="stat-value">{avgScore > 0 ? `${avgScore}%` : 'N/A'}</span>
                            <span className="stat-label">Average Fit Score</span>
                        </div>
                    </div>
                </section>

                {/* Main Generator Form Card */}
                <div className="interview-card glass-card">
                    <div className="interview-card__body">
                        {/* Left Panel - Job Description */}
                        <div className="panel panel--left">
                            <div className="panel__header">
                                <span className="panel__icon">💼</span>
                                <h2>Target Job Description</h2>
                                <span className="badge badge--required">Required</span>
                            </div>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                className="panel__textarea"
                                placeholder={`Paste target job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system architecture...'`}
                                maxLength={5000}
                            />
                            <div className="char-counter">{jobDescription.length} / 5000 chars</div>
                        </div>

                        <div className="panel-divider" />

                        {/* Right Panel - Profile & Resume */}
                        <div className="panel panel--right">
                            <div className="panel__header">
                                <span className="panel__icon">👤</span>
                                <h2>Your Profile</h2>
                            </div>

                            <div className="upload-section">
                                <label className="section-label">
                                    Upload Resume
                                    <span className="badge badge--best">Best Results</span>
                                </label>
                                <label className="dropzone" htmlFor="resume">
                                    <span className="dropzone__icon">📁</span>
                                    <p className="dropzone__title">{fileName ? fileName : "Click to upload or drag & drop"}</p>
                                    <p className="dropzone__subtitle">{fileName ? "File selected" : "PDF or DOCX (Max 5MB)"}</p>
                                    <input
                                        ref={resumeInputRef}
                                        onChange={handleFileChange}
                                        hidden
                                        type="file"
                                        id="resume"
                                        name="resume"
                                        accept=".pdf,.docx"
                                    />
                                </label>
                            </div>

                            <div className="or-divider"><span>OR</span></div>

                            <div className="self-description">
                                <label className="section-label" htmlFor="selfDescription">Quick Self-Description</label>
                                <textarea
                                    value={selfDescription}
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                    id="selfDescription"
                                    name="selfDescription"
                                    className="panel__textarea panel__textarea--short"
                                    placeholder="Briefly describe your experience, tech stack, and key skills if you don't have a resume file handy..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {errorMessage && (
                        <div className="error-banner">
                            ⚠️ {errorMessage}
                        </div>
                    )}

                    {/* Footer Submit Action */}
                    <div className="interview-card__footer">
                        <button onClick={handleGenerateReport} className="generate-btn">
                            <span className="btn-icon">⚡</span>
                            <span>Generate My Interview Strategy</span>
                        </button>
                    </div>
                </div>

                {/* Recent Interview Plans with Pagination & Search */}
                <section id="plans-section" className="recent-reports-section">
                    <div className="section-header">
                        <div className="header-left">
                            <h2>My Interview Plans</h2>
                            <span className="count-badge">{filteredReports.length} Plans</span>
                        </div>

                        {/* Search & Filter Controls */}
                        <div className="controls-right">
                            <div className="search-input-wrap">
                                <span className="search-icon">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search by job title..."
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                    className="search-input"
                                />
                            </div>

                            <select
                                value={scoreFilter}
                                onChange={(e) => { setScoreFilter(e.target.value); setCurrentPage(1); }}
                                className="filter-select"
                            >
                                <option value="all">All Match Scores</option>
                                <option value="high">High Match (80%+)</option>
                                <option value="mid">Mid Match (60-79%)</option>
                                <option value="low">Low Match (&lt;60%)</option>
                            </select>
                        </div>
                    </div>

                    {paginatedReports.length > 0 ? (
                        <>
                            <div className="reports-grid">
                                {paginatedReports.map(report => (
                                    <div
                                        key={report._id}
                                        className="report-card glass-card"
                                        onClick={() => navigate(`/interview/${report._id}`)}
                                    >
                                        <div className="card-top">
                                            <h3>{report.title || 'Untitled Role'}</h3>
                                            <span className={`score-badge ${report.matchScore >= 80 ? 'high' : report.matchScore >= 60 ? 'mid' : 'low'}`}>
                                                {report.matchScore}% Match
                                            </span>
                                        </div>
                                        <div className="card-bottom">
                                            <span className="date-text">
                                                📅 {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                            <span className="view-link">View Strategy →</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="pagination-bar">
                                    <span className="pagination-info">
                                        Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredReports.length)} of {filteredReports.length} plans
                                    </span>

                                    <div className="pagination-buttons">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            className="page-btn nav-btn"
                                        >
                                            ← Prev
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`page-btn num-btn ${currentPage === page ? 'active' : ''}`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        <button
                                            disabled={currentPage === totalPages}
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            className="page-btn nav-btn"
                                        >
                                            Next →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="empty-state glass-card">
                            <span className="empty-icon">📂</span>
                            <h3>No Interview Plans Found</h3>
                            <p>{reports.length === 0 ? "Generate your first interview plan using the form above!" : "No plans matched your search filter."}</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Home;