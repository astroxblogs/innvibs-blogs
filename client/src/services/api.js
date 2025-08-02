 
import axios from 'axios';
 
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
 
let accessToken = null;
 
const api = axios.create({
    baseURL: API_BASE_URL,
    // This tells Axios to include cookies (like our HTTP-only refresh token) in requests
    withCredentials: true,
});

/**
 * Function to set the access token in memory.
 * This will be called after a successful login or token refresh.
 * @param {string} token - The new access token.
 */
export const setAccessToken = (token) => {
    accessToken = token;
};

/**
 * Function to get the current access token from memory.
 * @returns {string|null} The current access token.
 */
export const getAccessToken = () => {
    return accessToken;
};

/**
 * Axios request interceptor to attach the access token to requests.
 * This runs before every API call.
 */
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            // Set the Authorization header with the Bearer token
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Axios response interceptor to handle token refresh logic.
 * This runs on every response and is crucial for our refresh token flow.
 */
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized errors and prevent infinite loops
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the access token
                const refreshResponse = await api.post('/api/admin/refresh-token');
                const newAccessToken = refreshResponse.data.accessToken;

                // Update the access token in memory
                setAccessToken(newAccessToken);

                // Retry the original request
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                console.error('Refresh token failed:', refreshError);
                // On a failed refresh attempt, clear the access token and redirect to login
                setAccessToken(null);
                window.location.href = '/admin/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle 403 Forbidden errors from a failed refresh attempt.
        // This is a new check for our updated backend logic.
        if (error.response?.status === 403) {
            console.error('Forbidden access, redirecting to login.', error.response?.data);
            setAccessToken(null);
            window.location.href = '/admin/login';
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

 
/**
 * Handles subscription requests.
 * @param {string} email - The email address to subscribe.
 * @returns {Promise<Object>} The response data from the backend.
 */
export const subscribeUser = async (email) => {
    try {
        const response = await api.post('/api/subscribe', { email });
        return response.data;
    } catch (error) {
        console.error('Error during subscription API call:', error);
        throw error;
    }
};

/**
 * Sends user like behavior to the backend for interest inference.
 * @param {string} subscriberId - The unique ID of the subscriber.
 * @param {string} blogId - The ID of the blog post that was liked.
 * @returns {Promise<Object>} The response data from the backend.
 */
export const trackUserLike = async (subscriberId, blogId) => {
    try {
        const response = await api.post('/api/track/like', { subscriberId, blogId });
        return response.data;
    } catch (error) {
        console.error('Error tracking user like:', error);
        throw error;
    }
};

/**
 * Sends user comment behavior to the backend.
 * @param {string} subscriberId - The unique ID of the subscriber.
 * @param {string} blogId - The ID of the blog post that was commented on.
 * @returns {Promise<Object>} The response data from the backend.
 */
export const trackUserComment = async (subscriberId, blogId) => {
    try {
        const response = await api.post('/api/track/comment', { subscriberId, blogId });
        return response.data;
    } catch (error) {
        console.error('Error tracking user comment:', error);
        throw error;
    }
};

/**
 * Tracks user read behavior.
 * @param {string} subscriberId - The unique ID of the subscriber.
 * @param {string} blogId - The ID of the blog post that was read.
 * @param {number} duration - The duration the user spent reading.
 * @returns {Promise<Object>} The response data from the backend.
 */
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
