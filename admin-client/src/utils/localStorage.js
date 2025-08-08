// astroxblogs-innvibs-admin-client/src/utils/localStorage.js

// This utility file is specifically for handling the admin's authentication token.
// It replaces the subscriber-related logic, which is only needed for the main blog.

const AUTH_TOKEN_KEY = 'astrox_admin_auth_token';

/**
 * Stores the admin's authentication token in localStorage.
 * @param {string} token - The JWT token received from the backend after login.
 */
export const setAuthToken = (token) => {
    try {
        if (token) {
            localStorage.setItem(AUTH_TOKEN_KEY, token);
            console.log('Admin auth token successfully set in localStorage.');
        } else {
            console.warn('Attempted to set a null or undefined auth token.');
        }
    } catch (error) {
        console.error('Error saving admin auth token to localStorage:', error);
    }
};

/**
 * Retrieves the admin's authentication token from localStorage.
 * @returns {string | null} The token if found, otherwise null.
 */
export const getAuthToken = () => {
    try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        return token;
    } catch (error) {
        console.error('Error retrieving admin auth token from localStorage:', error);
        return null;
    }
};

/**
 * Removes the admin's authentication token from localStorage, effectively logging out the user.
 */
export const removeAuthToken = () => {
    try {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        console.log('Admin auth token successfully removed from localStorage.');
    } catch (error) {
        console.error('Error removing admin auth token from localStorage:', error);
    }
};

/**
 * Checks if an admin authentication token exists in localStorage.
 * @returns {boolean} True if a token exists, false otherwise.
 */
export const hasAuthToken = () => {
    return !!getAuthToken();
};