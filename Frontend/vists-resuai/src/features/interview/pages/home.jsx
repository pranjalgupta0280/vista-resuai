import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useInterview } from '../hooks/useInterview.js';
import { getResumeVersions, recommendResumeVersion } from '../services/interview.api.js';
import Navbar from '../../../components/Navbar.jsx';
import ResumeVaultModal from '../../../components/ResumeVaultModal.jsx';
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

    // Resume Versioning states
    const [savedVersions, setSavedVersions] = useState([]);
    const [selectedVersionId, setSelectedVersionId] = useState("");
    const [recommendLoading, setRecommendLoading] = useState(false);
    const [recommendResult, setRecommendResult] = useState(null);
    const [isVaultOpen, setIsVaultOpen] = useState(false);

    // Search, Filter & Pagination states
    const [searchQuery, setSearchQuery] = useState("");
    const [scoreFilter, setScoreFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const fetchSavedVersions = async () => {
        try {
            const data = await getResumeVersions();
            if (data?.versions) {
                setSavedVersions(data.versions);
            }
        } catch (error) {
            console.error("Failed to fetch saved resume versions:", error);
        }
    };

    useEffect(() => {
        fetchSavedVersions();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            setSelectedVersionId(""); // Clear version selection if custom file uploaded
        } else {
            setFileName("");
        }
    };

    const handleSelectVersion = (e) => {
        const versionId = e.target.value;
        setSelectedVersionId(versionId);
        if (versionId && fileInputRef.current) {
            fileInputRef.current.value = ""; // Clear file input if version chosen
            setFileName("");
        }
    };

    const handleRecommendBestVersion = async () => {
        if (!jobDescription.trim()) {
            setErrorMessage("Please enter a Target Job Description first to get AI recommendations.");
            return;
        }

        if (savedVersions.length === 0) {
            setErrorMessage("No saved resume versions found. Click 'Resume Vault' in the navbar to add your versions (e.g. Google SWE, Amazon SDE)!");
            return;
        }

        setErrorMessage(null);
        setRecommendLoading(true);
        setRecommendResult(null);

        try {
            const data = await recommendResumeVersion({ jobDescription });
            if (data?.recommendation) {
                setRecommendResult(data.recommendation);
                // Automatically select the recommended version
                if (data.recommendation.recommendedVersionId) {
                    setSelectedVersionId(data.recommendation.recommendedVersionId);
                }
            }
        } catch (error) {
            console.error("Failed to recommend resume version:", error);
            setErrorMessage(error.response?.data?.message || "Failed to get AI recommendation.");
        } finally {
            setRecommendLoading(false);
        }
    };

    const handleGenerateReport = async () => {
        setErrorMessage(null);
        const resumeFile = resumeInputRef.current?.files[0];

        if (!jobDescription.trim()) {
            setErrorMessage("Please enter a Target Job Description.");
            return;
        }

        let resumeTextToUse = "";
        if (selectedVersionId) {
            const ver = savedVersions.find(v => v._id === selectedVersionId);
            if (ver) resumeTextToUse = ver.resumeText;
        }

        if (!resumeFile && !resumeTextToUse && !selfDescription.trim()) {
            setErrorMessage("Please select a saved Resume Version, upload a File, or provide a Quick Self-Description.");
            return;
        }

        try {
            const data = await generateReport({
                jobDescription,
                selfDescription,
                resumeFile,
                resumeText: resumeTextToUse
            });
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
                    <p>Upload your resume or pick a tailored version from your Resume Vault to receive personalized interview questions, ATS fit scoring, and prep roadmaps.</p>
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
                            <div className="panel-sub-actions">
                                <div className="char-counter">{jobDescription.length} / 5000 chars</div>

                                <button
                                    className="recommend-btn"
                                    onClick={handleRecommendBestVersion}
                                    disabled={recommendLoading}
                                >
                                    {recommendLoading ? "✨ Analyzing Versions..." : "✨ AI Recommend Best Resume"}
                                </button>
                            </div>
                        </div>

                        <div className="panel-divider" />

                        {/* Right Panel - Profile & Resume Versions */}
                        <div className="panel panel--right">
                            <div className="panel__header">
                                <span className="panel__icon">👤</span>
                                <h2>Select Resume Profile</h2>
                            </div>

                            {/* Resume Vault Version Dropdown */}
                            <div className="version-selector-group">
                                <label className="section-label">
                                    Saved Resume Version (Resume Vault)
                                    <button className="manage-vault-link" onClick={() => setIsVaultOpen(true)}>+ Manage Vault</button>
                                </label>

                                <select
                                    value={selectedVersionId}
                                    onChange={handleSelectVersion}
                                    className="version-dropdown"
                                >
                                    <option value="">-- Choose a Saved Resume Version --</option>
                                    {savedVersions.map(v => (
                                        <option key={v._id} value={v._id}>
                                            📁 {v.title} {v.targetRole ? `(${v.targetRole})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="or-divider"><span>OR UPLOAD NEW FILE</span></div>

                            <div className="upload-section">
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

                            <div className="or-divider"><span>OR QUICK BIO</span></div>

                            <div className="self-description">
                                <textarea
                                    value={selfDescription}
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                    id="selfDescription"
                                    name="selfDescription"
                                    className="panel__textarea panel__textarea--short"
                                    placeholder="Briefly describe your experience and tech stack if you don't have a resume handy..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* AI Recommendation Banner */}
                    {recommendResult && (
                        <div className="recommendation-banner glass-card">
                            <div className="banner-top">
                                <div className="badge-glow">✨ AI ATS Recommendation</div>
                                <span className="score-pill">{recommendResult.atsScore}% Estimated ATS Score</span>
                            </div>
                            <h3>
                                Recommended Version: <span className="highlight-cyan">{recommendResult.recommendedTitle}</span>
                            </h3>
                            <p className="reason-text">{recommendResult.reason}</p>

                            <button
                                className="apply-rec-btn"
                                onClick={() => {
                                    if (recommendResult.recommendedVersionId) {
                                        setSelectedVersionId(recommendResult.recommendedVersionId);
                                    }
                                }}
                            >
                                ✓ Version Selected for Interview Strategy
                            </button>
                        </div>
                    )}

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