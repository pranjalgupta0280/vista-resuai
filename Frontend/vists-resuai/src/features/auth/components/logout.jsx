import React from 'react';
import { useAuth } from '../hooks/useAuth';

const LogoutButton = () => {
    // Pull the logic directly from the custom hook
    const { handleLogout, loading } = useAuth();

    return (
        <button 
            onClick={handleLogout} 
            disabled={loading}
            className="button secondary-button"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            {loading ? 'Logging out...' : 'Logout'}
        </button>
    );
};

export default LogoutButton;