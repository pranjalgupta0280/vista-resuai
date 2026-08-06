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
        return (<main><h1>Loading....</h1></main>);
    }

    return (
        <main>
            <div className="form-container">
                <h1>LOGIN</h1>
                {errorMsg && (
                    <div style={{ color: "#e53e3e", marginBottom: "1rem", textAlign: "center", fontSize: "0.9rem" }}>
                        ⚠️ {errorMsg}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input onChange={(e) => { setEmail(e.target.value) }} type="email" id='email' name='email' placeholder='Enter email' required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input onChange={(e) => { setPassword(e.target.value) }} type="password" id='password' name='password' placeholder='Enter password' required />
                    </div>
                    <button className='button primary-button'>Submit</button>
                </form>
                <p>New Here? <Link to={"/register"}>Register</Link></p>
            </div>
        </main>
    );
};

export default Login;
