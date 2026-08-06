import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useInterview } from '../hooks/useInterview.js';
import { getResumeVersions, recommendResumeVersion } from '../services/interview.api.js';
import Navbar from '../../../components/Navbar.jsx';
import ResumeVaultModal from '../../../components/ResumeVaultModal.jsx';
import '../styles/createStrategyPage.scss';

const CreateStrategyPage = () => {
    const { loading, generateReport } = useInterview();
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
            setSelectedVersionId("");
        } else {
            setFileName("");
        }
    };

    const handleSelectVersion = (e) => {
        const versionId = e.target.value;
        setSelectedVersionId(versionId);
        if (versionId && fileInputRef.current) {
            fileInputRef.current.value = "";
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

    if (loading) {
        return (
            <div className="create-page-wrapper">
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
        <div className="create-page-wrapper">
            <Navbar />

            <div className="create-container">
                {/* Header */}
                <header className="page-header">
                    <div className="hero-badge">⚡ AI STRATEGY STUDIO</div>
                    <h1>Create Your <span className="highlight">Interview Strategy</span></h1>
                    <p>Provide target job requirements and select your tailored resume version to receive custom technical questions, STAR answers, and skill gap roadmaps.</p>
                </header>

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
            </div>

            <ResumeVaultModal isOpen={isVaultOpen} onClose={() => setIsVaultOpen(false)} />
        </div>
    );
};

export default CreateStrategyPage;
