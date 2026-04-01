// api.js
import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/",
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Helper to dispatch custom events when token changes
const dispatchTokenEvent = (type, token) => {
    window.dispatchEvent(new CustomEvent('tokenChanged', { detail: { type, token } }));
};

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }
        originalRequest._retry = true;

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                })
                .catch(err => Promise.reject(err));
        }

        isRefreshing = true;
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (!refreshToken) {
            // Clear tokens and redirect
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            dispatchTokenEvent('logout', null);
            window.location.href = '/login';
            return Promise.reject(error);
        }

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/"}token/refresh/`,
                { refresh: refreshToken }
            );
            localStorage.setItem(ACCESS_TOKEN, data.access);
            if (data.refresh) {
                localStorage.setItem(REFRESH_TOKEN, data.refresh);
            }
            dispatchTokenEvent('refresh', data.access);
            originalRequest.headers.Authorization = `Bearer ${data.access}`;
            processQueue(null, data.access);
            return api(originalRequest);
        } catch (refreshError) {
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            dispatchTokenEvent('logout', null);
            processQueue(refreshError, null);
            window.location.href = '/login';
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;