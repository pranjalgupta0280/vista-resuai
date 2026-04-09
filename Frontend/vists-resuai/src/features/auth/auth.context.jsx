import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 1. Try to grab the user from localStorage immediately on boot
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
    });

    const [loading, setLoading] = useState(false);
    
    // 2. Add an initialization flag
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            // Optional: You could call a /me or /verify endpoint here 
            // to make sure the token hasn't actually expired on the server
            setUser(JSON.parse(savedUser));
        }
        
        setIsInitializing(false); // We are done checking localStorage
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, isInitializing }}>
            {children}
        </AuthContext.Provider>
    );
};