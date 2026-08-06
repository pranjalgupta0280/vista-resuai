import { useAuth } from "../hooks/useAuth";
import React from 'react';
import { Navigate } from "react-router";

const Protected = ({ children }) => {
    const { user, isInitializing } = useAuth();

    if (isInitializing) {
        return (
            <main className="loading-screen">
                <h1>Loading...</h1>
            </main>
        );
    }

    if (!user) {
        return <Navigate to={'/login'} replace />;
    }

    return children;
};

export default Protected;