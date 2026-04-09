import { useContext,useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login,register,logout,getMe } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            // 1. Persist to localStorage for the next refresh
            localStorage.setItem('user', JSON.stringify(data.user));
            // 2. Update React state
            setUser(data.user);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            // Clear everything
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
        } catch (error) {
            console.log(error);
        }
    };

useEffect(() => {
    const getAndSetUser = async () => {
        // Only fetch if we have a token but no user state
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const data = await getMe();
            if (data?.user) {
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
        } catch (error) {
            console.error("Session expired", error);
            // Only clear if the server actually says the token is invalid
            handleLogout(); 
        } finally {
            setLoading(false);
        }
    };

    getAndSetUser();
}, []);
       // Added setUser to dependency array

    return { user, loading, handleRegister, handleLogin, handleLogout };
};