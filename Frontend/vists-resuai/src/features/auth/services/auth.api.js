import axios from 'axios';

const BASE_URL = (import.meta.env.VITE_API_URL || 'https://vista-resuai-4.onrender.com').replace(/\/$/, '');

const API = axios.create({
    baseURL: `${BASE_URL}/api/auth`,
    withCredentials: true
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function register({ username, email, password }) {
    try {
        const response = await API.post('/register', { username, email, password });
        return response.data;
    } catch (error) {
        console.error("Register Error:", error.response?.data || error.message);
        throw error;
    }
}

export async function login({ email, password }) {
    try {
        const response = await API.post('/login', { email, password });
        return response.data;
    } catch (error) {
        console.error("Login Error:", error.response?.data || error.message);
        throw error;
    }
}

export async function logout() {
    try {
        const response = await API.post('/logout');
        return response.data;
    } catch (error) {
        console.error("Logout Error:", error.response?.data || error.message);
    }
}

export async function getMe() {
    try {
        const response = await API.get('/me');
        return response.data;
    } catch (error) {
        console.error("getMe Error:", error.response?.data || error.message);
        throw error;
    }
}

export const logoutUserAPI = async () => {
    try {
        return await logout();
    } catch (error) {
        console.error("API Error during logout:", error);
        throw error;
    }
};