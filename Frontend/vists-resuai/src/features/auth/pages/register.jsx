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
        return (<main><h1>Loading....</h1></main>);
    }

    return (
        <main>
            <div className="form-container">
                <h1>REGISTER</h1>
                {errorMsg && (
                    <div style={{ color: "#e53e3e", marginBottom: "1rem", textAlign: "center", fontSize: "0.9rem" }}>
                        ⚠️ {errorMsg}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input onChange={(e) => { setUsername(e.target.value) }} type="text" id='username' name='username' placeholder='Enter username' required />
                    </div>
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
                <p>Already have an Account? <Link to={"/login"}>Login</Link></p>
            </div>
        </main>
    );
}

export default Register;
