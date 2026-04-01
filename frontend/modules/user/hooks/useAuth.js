// hooks/useAuth.js
import { useState, useEffect } from 'react';
import { ACCESS_TOKEN } from '../../../src/constants';
import { jwtDecode } from 'jwt-decode';

const checkToken = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) return false;
    try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        return decoded.exp > now;
    } catch {
        return false;
    }
};

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(checkToken());

    useEffect(() => {
        const handleTokenChange = () => {
            setIsAuthenticated(checkToken());
        };
        // Listen to custom event
        window.addEventListener('tokenChanged', handleTokenChange);
        // Also listen to storage events (for changes in other tabs)
        window.addEventListener('storage', handleTokenChange);
        return () => {
            window.removeEventListener('tokenChanged', handleTokenChange);
            window.removeEventListener('storage', handleTokenChange);
        };
    }, []);

    return { isAuthenticated };
};