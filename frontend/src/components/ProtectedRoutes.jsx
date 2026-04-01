import { Navigate } from 'react-router-dom';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

function ProtectedRoutes({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            if (!token) {
                setIsAuthorized(false);
                return;
            }

            try {
                const decoded = jwtDecode(token);
                const now = Date.now() / 1000;
                const isExpired = decoded.exp < now;

                if (isExpired) {
                    // Attempt to refresh token
                    const refreshed = await refreshToken();
                    if (refreshed) {
                        setIsAuthorized(true);
                    } else {
                        setIsAuthorized(false);
                    }
                } else {
                    setIsAuthorized(true);
                }
            } catch (err) {
                console.error('Token decode error:', err);
                setIsAuthorized(false);
            }
        };

        const refreshToken = async () => {
            const refresh = localStorage.getItem(REFRESH_TOKEN);
            if (!refresh) return false;

            try {
                // Use the same baseURL as api (already includes /api/)
                const res = await api.post('/token/refresh/', { refresh });
                if (res.status === 200) {
                    localStorage.setItem(ACCESS_TOKEN, res.data.access);
                    // Some backends also return a new refresh token
                    if (res.data.refresh) {
                        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                    }
                    return true;
                }
                return false;
            } catch (error) {
                console.error('Refresh token failed:', error);
                return false;
            }
        };

        checkAuth();
    }, []);

    if (isAuthorized === null) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoutes;