 

const SUBSCRIBER_ID_KEY = 'astrox_subscriber_id';

/**
 * Stores the subscriber ID in localStorage.
 * @param {string} subscriberId - The unique ID received from the backend.
 */
export const setSubscriberId = (subscriberId) => {

    console.log('DEBUG (localStorage): Attempting to set subscriberId:', subscriberId); // NEW DEBUG LOG
    if (!subscriberId) {
        console.error('DEBUG (localStorage): Attempted to set null/undefined subscriberId.'); // NEW DEBUG LOG
        return;
    }
    try {
        localStorage.setItem(SUBSCRIBER_ID_KEY, subscriberId);
        console.log('DEBUG (localStorage): Subscriber ID successfully set in localStorage.'); // NEW DEBUG LOG
    } catch (error) {
        console.error('DEBUG (localStorage): Error saving subscriber ID to localStorage:', error); // NEW DEBUG LOG
    }
}

/**
 * Retrieves the subscriber ID from localStorage.
 * @returns {string | null} The subscriber ID if found, otherwise null.
 */
export const getSubscriberId = () => {
    try {
        const id = localStorage.getItem(SUBSCRIBER_ID_KEY);
        console.log('DEBUG (localStorage): Retrieved subscriberId:', id); // NEW DEBUG LOG
        return id;
    } catch (error) {
        console.error('DEBUG (localStorage): Error retrieving subscriber ID from localStorage:', error); // NEW DEBUG LOG
        return null;
    }
};

/**
 * Removes the subscriber ID from localStorage (e.g., for testing or if user unsubscribes).
 */
export const removeSubscriberId = () => {
    try {
        localStorage.removeItem(SUBSCRIBER_ID_KEY);
    } catch (error) {
        console.error('Error removing subscriber ID from localStorage:', error);
        
    }
};

/**
 * Checks if a subscriber ID exists in localStorage.
 * @returns {boolean} True if subscriber ID exists, false otherwise.
 */

export const hasSubscriberId = () => {
    const hasId = !!getSubscriberId();
    console.log('DEBUG (localStorage): hasSubscriberId check:', hasId); // NEW DEBUG LOG
    return hasId;
};