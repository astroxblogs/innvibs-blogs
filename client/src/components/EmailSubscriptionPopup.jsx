// client/src/components/EmailSubscriptionPopup.jsx
import React, { useState } from 'react';
import { setSubscriberId } from '../utils/localStorage';
import { subscribeUser } from '../services/api';


// NEW: Accept 'showPopup' and 'onClose' and 'onSubscribeSuccess' as props
const EmailSubscriptionPopup = ({ showPopup, onClose, onSubscribeSuccess }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // REMOVED: The useEffect that previously controlled automatic popup display.
    // Its visibility is now entirely controlled by the 'showPopup' prop from its parent.

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages
        setIsSubmitting(true);

        // Basic client-side email validation
        if (!email || !email.includes('@') || !email.includes('.')) {
            setMessage('Please enter a valid email address.');
            setIsSubmitting(false);
            return;
        }

        try {
            const data = await subscribeUser(email);
            // NEW DEBUG LOG: What data is received from the backend?
            console.log('DEBUG (Popup): Backend response data after subscription:', data);

            if (data && data.subscriberId) { // Ensure data and subscriberId exist before attempting to store
                setSubscriberId(data.subscriberId); // Store the received ID in localStorage
                console.log('DEBUG (Popup): setSubscriberId called with:', data.subscriberId); // NEW DEBUG LOG
            } else {
                console.error('DEBUG (Popup): Backend response did NOT contain subscriberId:', data); // NEW DEBUG LOG
            }

            setMessage(data.msg || 'Thank you for subscribing!');
            setIsSuccess(true);

            // NEW: Call the onSubscribeSuccess prop to inform the parent component
            if (onSubscribeSuccess) {
                onSubscribeSuccess();
            }

            // Optionally hide popup after a short delay on success
            setTimeout(() => {
                if (onClose) onClose(); // Use the onClose prop to hide
            }, 1500); // Shorter delay for better UX

        } catch (error) {
            console.error('DEBUG (Popup): Error during subscription API call in Popup:', error); // NEW DEBUG LOG
            setMessage(error.message || 'Subscription failed. Please try again.');
            setIsSuccess(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!showPopup) { // Now directly uses the 'showPopup' prop
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 w-full max-w-md relative">
                <button
                    onClick={onClose} // Use onClose prop for the close button
                    className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-200 text-2xl font-bold"
                    aria-label="Close popup"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">
                    Stay Updated with innvibs
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
                    Enter your email to get the latest blog posts directly in your inbox.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="sr-only">Email address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                            required
                            disabled={isSubmitting || isSuccess}
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full px-4 py-2 rounded-md font-semibold ${isSubmitting
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                            } text-white transition-colors duration-200`}
                        disabled={isSubmitting || isSuccess}
                    >
                        {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
                    </button>
                </form>

                {message && (
                    <p className={`mt-4 text-center ${isSuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default EmailSubscriptionPopup;