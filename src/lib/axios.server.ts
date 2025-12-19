import 'server-only';

import axios from 'axios';
import {auth} from "@/auth";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

instance.interceptors.request.use(
    async (config) => {
        const session = await auth();

        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const event = new Event('unauthorized');
            window.dispatchEvent(event);
        }

        return Promise.reject(error);
    }
);

export default instance;