import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';
import AiTipsModal from './AiTipsModal';
import ResumeVaultModal from './ResumeVaultModal';
import './navbar.scss';

const Navbar = () => {
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isTipsOpen, setIsTipsOpen] = useState(false);
    const [isVaultOpen, setIsVaultOpen] = useState(false);

    const onLogout = async () => {
        await handleLogout();
        navigate('/login');
    };

    const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U');

    return (
        <>
            <nav className="navbar-container">
                <div className="navbar-content">
                    {/* Brand Logo */}
                    <Link to="/" className="brand-logo">
                        <div className="logo-icon-wrap">
                            <svg className="logo-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#logo-grad)"/>
                                <defs>
                                    <linearGradient id="logo-grad" x1="2" y1="2" x2="22" y2="21" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#00F2FE"/>
                                        <stop offset="1" stopColor="#9333EA"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className="logo-text">
                            Vista <span className="logo-badge">ResuAI</span>
                        </div>
                    </Link>

                    {/* Navigation Items */}
                    <div className="nav-items">
                        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                            <span className="link-icon">📊</span>
                            <span>Dashboard</span>
                        </Link>

                        <button className="nav-link vault-btn" onClick={() => setIsVaultOpen(true)}>
                            <span className="link-icon">📁</span>
                            <span>Resume Vault</span>
                        </button>
                        
                        <a href="#plans-section" className="nav-link">
                            <span className="link-icon">📄</span>
                            <span>My Plans</span>
                        </a>

                        <button className="nav-link tips-btn" onClick={() => setIsTipsOpen(true)}>
                            <span className="link-icon">✨</span>
                            <span>AI Resume Guide</span>
                        </button>
                    </div>

                    {/* Right User Actions */}
                    <div className="nav-user-actions">
                        {user && (
                            <div className="user-pill">
                                <div className="avatar-circle">{userInitial}</div>
                                <span className="user-name">{user.username || user.email?.split('@')[0]}</span>
                            </div>
                        )}

                        <button onClick={onLogout} className="logout-btn" title="Sign out">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            <AiTipsModal isOpen={isTipsOpen} onClose={() => setIsTipsOpen(false)} />
            <ResumeVaultModal isOpen={isVaultOpen} onClose={() => setIsVaultOpen(false)} />
        </>
    );
};

export default Navbar;
