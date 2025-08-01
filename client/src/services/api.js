// client/src/services/api.js

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * Handles subscription requests.
 * @param {string} email - The email address to subscribe.
 * @returns {Promise<Object>} The response data from the backend.
 */
export const subscribeUser = async (email) => {
     
    try {
        const response = await fetch(`${API_BASE_URL}/api/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Subscription failed due to a server error.');
        }

        return await response.json();

    } catch (error) {
        console.error('Error during subscription API call:', error);
        throw error;
    }
};


/**
 * Sends user like behavior to the backend for interest inference.
 * @param {string} subscriberId - The unique ID of the subscriber from localStorage.
 * @param {string} blogId - The ID of the blog post that was liked.
 * @returns {Promise<Object>} The response data from the backend.
 */
export const trackUserLike = async (subscriberId, blogId) => { // <-- ADD THIS NEW FUNCTION
    try {
        const response = await fetch(`${API_BASE_URL}/api/track/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subscriberId, blogId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Failed to track like behavior.');
        }

        return await response.json();

    } catch (error) {
        console.error('Error tracking user like:', error);
        // It might be okay to not re-throw here if tracking is non-critical for user experience
        // but re-throwing allows the component to handle it if needed.
        throw error;
    }
};
export const trackUserComment = async (subscriberId, blogId) => { // <-- ADD THIS NEW FUNCTION
    try {
        const response = await fetch(`${API_BASE_URL}/api/track/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subscriberId, blogId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Failed to track comment behavior.');
        }

        return await response.json();

    } catch (error) {
        console.error('Error tracking user comment:', error);
        throw error;
    }
};

export const trackUserRead = async (subscriberId, blogId, duration) => {  
    try {
        const response = await fetch(`${API_BASE_URL}/api/track/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subscriberId, blogId, duration }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Failed to track read behavior.');
        }

        return await response.json();

    } catch (error) {
        console.error('Error tracking user read behavior:', error);
        throw error;
    }
};
 