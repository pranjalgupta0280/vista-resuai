import { createContext, useState, useEffect } from 'react';
import { getMe } from './services/auth.api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Grab user from localStorage on initial render
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [loading, setLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const verifyUserSession = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsInitializing(false);
                return;
            }

            try {
                const data = await getMe();
                if (data?.user) {
                    setUser(data.user);
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
            } catch (error) {
                console.error("Session verification failed:", error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setIsInitializing(false);
            }
        };

        verifyUserSession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, isInitializing }}>
            {children}
        </AuthContext.Provider>
    );
};