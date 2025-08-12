// astroxblogs-innvibs-admin-client/src/services/api.js

import axios from 'axios';
import { setAuthToken, getAuthToken, removeAuthToken } from '../utils/localStorage';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const setAccessToken = (token) => {
    console.log('setAccessToken called. Token is now:', token ? '[SET]' : null);
    if (token) {
        setAuthToken(token);  
    } else {
        removeAuthToken();  
    }
};

export const getAccessToken = () => {
    return getAuthToken();  
};

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.log('Request Interceptor: Sending request for', config.url, 'without token.');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        // If this is a successful response from the login endpoint, store the access token.
        if (response.config.url.includes('/api/admin/login') && response.data.accessToken) {
            setAccessToken(response.data.accessToken);
            console.log('Response Interceptor: Access token received from login and set.');
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check for 401 Unauthorized errors
        if (error.response?.status === 401) {
            // Check if the request that failed was the refresh token request itself
            if (originalRequest.url.includes('/api/admin/refresh-token')) {
                console.error('Response Interceptor: Refresh token request failed with 401. Logging out.');
                setAccessToken(null);
                processQueue(error);
                window.location.href = '/login'; // Redirect to login
                return Promise.reject(error);
            }

            // If a refresh is already in progress, queue the request
            if (isRefreshing) {
                console.log('Response Interceptor: Refresh in progress, queuing original request.');
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            // If not refreshing, set flag and attempt refresh
            isRefreshing = true;
            console.log('Response Interceptor: Caught 401 error. Attempting token refresh...');

            try {
                const refreshResponse = await api.post('/api/admin/refresh-token');
                const newAccessToken = refreshResponse.data.accessToken;

                setAccessToken(newAccessToken);
                console.log('Response Interceptor: Token refreshed successfully.');

                // Process the queue with the new token
                processQueue(null, newAccessToken);
                isRefreshing = false;

                // Retry the original request
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                console.error('Response Interceptor: Refresh token failed. Redirecting to login.', refreshError);
                setAccessToken(null);
                processQueue(refreshError);
                isRefreshing = false;
                window.location.href = '/login'; // Redirect to login
                return Promise.reject(refreshError);
            }
        }

        // Handle 403 Forbidden errors
        if (error.response?.status === 403) {
            console.error('Response Interceptor: Caught 403 Forbidden. Redirecting to login.', error.response?.data);
            setAccessToken(null);
            processQueue(error);
            window.location.href = '/login'; // Redirect to login
            return Promise.reject(error);
        }

        console.log('Response Interceptor: Unhandled error caught for', error.config?.url, ':', error.message);
        return Promise.reject(error);
    }
);

export default api;