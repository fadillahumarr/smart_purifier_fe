import axios from "axios";
import endpoints from "./endpoints";
import routes from "../routes";
import { deleteCookie, getCookie, setCookie } from "./cookies";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

const rawApi = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    const token = getCookie("access_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = getCookie("refresh_token");

            if (!refreshToken) {
                deleteCookie("access_token");
                deleteCookie("refresh_token");
                window.location.replace(routes.login);
                return Promise.reject(error);
            }

            try {
                const res = await rawApi.post(endpoints.auth.refresh, {
                    refresh_token: refreshToken,
                });

                const { access_token, refresh_token } = res.data;

                setCookie("access_token", access_token);
                setCookie("refresh_token", refresh_token);

                originalRequest.headers.Authorization = `Bearer ${access_token}`;

                return api(originalRequest);
            } catch (refreshError) {
                deleteCookie("access_token");
                deleteCookie("refresh_token");
                window.location.replace(routes.login);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;