import React from 'react'
import { Link } from 'react-router';
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { useNavigate } from 'react-router';
const Login = () => {
    const { loading, handleLogin } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        try {
            await handleLogin({ email, password });
            navigate("/");
        } catch (error) {
            setErrorMsg(error.response?.data?.message || "Login failed. Please check your credentials.");
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
                    <h1>Welcome Back</h1>
                    <p>Sign in to access your interview strategy dashboard</p>
                </div>

                {errorMsg && (
                    <div className="error-alert">
                        ⚠️ {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
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

                    <button className="auth-submit-btn">Sign In to Dashboard</button>
                </form>

                <p className="auth-footer-link">
                    New Here? <Link to="/register">Create an Account</Link>
                </p>
            </div>
        </main>
    );
};

export default Login;
