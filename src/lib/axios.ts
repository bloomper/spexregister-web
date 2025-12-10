import axios from 'axios';
import { getSession } from 'next-auth/react';

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

instance.interceptors.request.use(
    async (config) => {
        const session = await getSession();

        if (session?.accessToken) {
            config.headers.Authorization = `Bearer ${session.accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            // You might want to trigger a session refresh or redirect
            const event = new Event('unauthorized');
            window.dispatchEvent(event);
        }

        return Promise.reject(error);
    }
);

export default instance;