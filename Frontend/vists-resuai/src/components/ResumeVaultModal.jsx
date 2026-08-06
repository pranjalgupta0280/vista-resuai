import React, { useState, useEffect, useRef } from 'react';
import { getResumeVersions, createResumeVersion, deleteResumeVersion } from '../features/interview/services/interview.api';
import './resumeVaultModal.scss';

const ResumeVaultModal = ({ isOpen, onClose, onSelectVersion }) => {
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [title, setTitle] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [resumeText, setResumeText] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const fileInputRef = useRef();

    const fetchVersions = async () => {
        setLoading(true);
        try {
            const data = await getResumeVersions();
            if (data?.versions) {
                setVersions(data.versions);
            }
        } catch (error) {
            console.error("Failed to fetch resume versions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchVersions();
        }
    }, [isOpen]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        const resumeFile = fileInputRef.current?.files[0];

        if (!title.trim()) {
            setErrorMsg("Please enter a title for this resume version.");
            return;
        }

        if (!resumeFile && !resumeText.trim()) {
            setErrorMsg("Please upload a resume file or paste text content.");
            return;
        }

        try {
            await createResumeVersion({ title, targetRole, resumeFile, resumeText });
            setTitle('');
            setTargetRole('');
            setResumeText('');
            if (fileInputRef.current) fileInputRef.current.value = '';
            setShowAddForm(false);
            fetchVersions();
        } catch (error) {
            console.error("Error creating resume version:", error);
            setErrorMsg(error.response?.data?.message || "Failed to save version.");
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this resume version?")) {
            try {
                await deleteResumeVersion(id);
                fetchVersions();
            } catch (error) {
                console.error("Error deleting version:", error);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-card vault-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">
                        <span className="vault-icon">📁</span>
                        <h2>Resume Vault <span className="version-badge">{versions.length} Versions</span></h2>
                    </div>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    {!showAddForm ? (
                        <>
                            <div className="vault-actions">
                                <p className="vault-desc">
                                    Manage tailored resume versions for different target roles. AI will score these to recommend the best match!
                                </p>
                                <button className="add-version-btn" onClick={() => setShowAddForm(true)}>
                                    + Add New Version
                                </button>
                            </div>

                            {loading ? (
                                <div className="vault-loading">Loading saved versions...</div>
                            ) : versions.length > 0 ? (
                                <div className="versions-tree">
                                    {versions.map((ver, idx) => (
                                        <div
                                            key={ver._id}
                                            className="version-card glass-card"
                                            onClick={() => {
                                                if (onSelectVersion) onSelectVersion(ver);
                                                onClose();
                                            }}
                                        >
                                            <div className="ver-header">
                                                <span className="ver-tag">Version {versions.length - idx}</span>
                                                <h3 className="ver-title">{ver.title}</h3>
                                                <button
                                                    className="delete-ver-btn"
                                                    onClick={(e) => handleDelete(ver._id, e)}
                                                    title="Delete Version"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                            <p className="ver-meta">
                                                <span>📄 {ver.fileName || 'Tailored Document'}</span>
                                                <span>📅 {new Date(ver.createdAt).toLocaleDateString()}</span>
                                            </p>
                                            {ver.targetRole && (
                                                <span className="role-chip">🎯 {ver.targetRole}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-vault">
                                    <span className="icon">📂</span>
                                    <h3>No Resume Versions Saved</h3>
                                    <p>Add version profiles like <em>Google SWE</em>, <em>Amazon SDE</em>, or <em>Backend Engineer</em>!</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <form className="add-version-form" onSubmit={handleCreate}>
                            <h3>Create Tailored Resume Version</h3>
                            {errorMsg && <div className="form-error">⚠️ {errorMsg}</div>}

                            <div className="input-group">
                                <label>Version Title (e.g., Google SWE, Backend Engineer)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Google SWE - System Architecture Focus"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Target Role / Tag (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Senior Frontend / Fullstack"
                                    value={targetRole}
                                    onChange={(e) => setTargetRole(e.target.value)}
                                />
                            </div>

                            <div className="input-group">
                                <label>Upload Resume File (PDF / DOCX)</label>
                                <input ref={fileInputRef} type="file" accept=".pdf,.docx" />
                            </div>

                            <div className="or-divider"><span>OR PASTE TEXT</span></div>

                            <div className="input-group">
                                <label>Resume Content Text</label>
                                <textarea
                                    rows={5}
                                    placeholder="Paste tailored resume bullet points here..."
                                    value={resumeText}
                                    onChange={(e) => setResumeText(e.target.value)}
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn">
                                    Save Version to Vault
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeVaultModal;
