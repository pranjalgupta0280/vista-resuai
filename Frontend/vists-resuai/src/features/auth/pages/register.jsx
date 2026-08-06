import React from 'react'
import "../auth.form.scss"
import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { useNavigate } from 'react-router';
function Register() {
    const { loading, handleRegister } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        try {
            await handleRegister({ username, email, password });
            navigate("/");
        } catch (error) {
            setErrorMsg(error.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    if (loading) {
        return (
            <main className="auth-page">
                <div className="spinner-glow"></div>
            </main>
        );
    }

    return (
        <main className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-brand">
                        <div className="logo-icon">✨</div>
                        <div className="logo-text">Vista <span>ResuAI</span></div>
                    </div>
                    <h1>Create Account</h1>
                    <p>Start building AI-powered interview plans today</p>
                </div>

                {errorMsg && (
                    <div className="error-alert">
                        ⚠️ {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            id="username"
                            name="username"
                            placeholder="johndoe"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="yourname@example.com"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button className="auth-submit-btn">Create Free Account</button>
                </form>

                <p className="auth-footer-link">
                    Already have an Account? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </main>
    );
}

export default Register;
