import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    const { user, setUser, loading, setLoading, isInitializing } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            if (data?.token) {
                localStorage.setItem('token', data.token);
            }
            if (data?.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
            }
            return data;
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            if (data?.token) {
                localStorage.setItem('token', data.token);
            }
            if (data?.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
            }
            return data;
        } catch (error) {
            console.error("Register Error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout Error:", error);
        } finally {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    return { user, loading, isInitializing, handleRegister, handleLogin, handleLogout };
};