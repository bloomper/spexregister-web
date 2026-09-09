import "server-only";

import axios from "axios";
import {getAccessToken} from "@/utils/auth.server";
import {getLocale} from "next-intl/server";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

instance.interceptors.request.use(
    async (config) => {
        try {
            const accessToken = await getAccessToken();

            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }

            config.headers.AcceptLanguage = await getLocale();
        } catch (error) {
            console.warn("Axios server: Could not retrieve session for auth header", error);
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
        return Promise.reject(error);
    }
);

export default instance;
