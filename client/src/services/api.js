// client/src/services/api.js
import axios from 'axios';

// The base URL for all API requests
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Store the access token in memory
let accessToken = null;

// Create a custom Axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const setAccessToken = (token) => {
    // Debug log to see when the token is set
    console.log('setAccessToken called. Token is now:', token ? '[SET]' : null);
    accessToken = token;
};

export const getAccessToken = () => {
    return accessToken;
};

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            console.log('Request Interceptor: Sending request with token:', token.substring(0, 20) + '...');
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.log('Request Interceptor: Sending request without token.');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log('Response Interceptor: Caught 401 error. Attempting token refresh...');
            originalRequest._retry = true;

            try {
                const refreshResponse = await api.post('/api/admin/refresh-token');
                const newAccessToken = refreshResponse.data.accessToken;

                console.log('Response Interceptor: Token refreshed successfully. Retrying original request.');
                setAccessToken(newAccessToken);

                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                console.error('Response Interceptor: Refresh token failed. Redirecting to login.');
                setAccessToken(null);
                window.location.href = '/admin/login';
                return Promise.reject(refreshError);
            }
        }

        if (error.response?.status === 403) {
            console.error('Response Interceptor: Caught 403 Forbidden. Redirecting to login.', error.response?.data);
            setAccessToken(null);
            window.location.href = '/admin/login';
            return Promise.reject(error);
        }

        console.log('Response Interceptor: Unhandled error caught:', error.message);
        return Promise.reject(error);
    }
);

export const subscribeUser = async (email) => {
    try {
        const response = await api.post('/api/subscribe', { email });
        return response.data;
    } catch (error) {
        console.error('Error during subscription API call:', error);
        throw error;
    }
};

export const trackUserLike = async (subscriberId, blogId) => {
    try {
        const response = await api.post('/api/track/like', { subscriberId, blogId });
        return response.data;
    } catch (error) {
        console.error('Error tracking user like:', error);
        throw error;
    }
};

export const trackUserComment = async (subscriberId, blogId) => {
    try {
        const response = await api.post('/api/track/comment', { subscriberId, blogId });
        return response.data;
    } catch (error) {
        console.error('Error tracking user comment:', error);
        throw error;
    }
};

export const trackUserRead = async (subscriberId, blogId, duration) => {
    try {
        const response = await api.post('/api/track/read', { subscriberId, blogId, duration });
        return response.data;
    } catch (error) {
        console.error('Error tracking user read behavior:', error);
        throw error;
    }
};

export default api;
