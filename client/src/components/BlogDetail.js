// client/src/components/BlogDetail.js
import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

// Utility imports
import { getSubscriberId, hasSubscriberId } from '../utils/localStorage';
import { trackUserRead } from '../services/api';

// Component imports
import LikeButton from '../components/LikeButton.jsx';
import EmailSubscriptionPopup from './EmailSubscriptionPopup';
const CommentSection = React.lazy(() => import('../components/CommentSection'));


// Helper functions
const createSafeAltText = (text) => {
    if (!text) return '';
    return text.replace(/\b(image|photo|picture)\b/gi, '').replace(/\s\s+/g, ' ').trim();
};

const getLocalizedContent = (field, blogData, currentLang) => {
    const localizedField = blogData[`${field}_${currentLang}`];
    if (localizedField) {
        return localizedField;
    }
    if (blogData[`${field}_en`]) {
        return blogData[`${field}_en`];
    }
    return blogData[field] || '';
};

const MIN_READ_DURATION_SECONDS = 30; // Minimum duration to track a 'read' event
const EXCERPT_LENGTH_CHARS = 500; // Characters to show for non-subscribers

const BlogDetail = () => {
    const { id } = useParams();
    const { i18n } = useTranslation();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for Subscription Wall
    const [isSubscribed, setIsSubscribed] = useState(hasSubscriberId());
    const [showGatedPopup, setShowGatedPopup] = useState(false); // To explicitly show popup for gated content

    // Read time tracking refs
    const startTimeRef = useRef(null);
    const timeSpentRef = useRef(0);
    const lastActivityTimeRef = useRef(Date.now());

    // Function to send read duration to backend
    const sendReadTrackingData = async (currentBlogId, currentSubscriberId, duration) => {
        // NEW DEBUG LOGS
        console.log('DEBUG: sendReadTrackingData called with:', { currentBlogId, currentSubscriberId, duration }); // <-- Debug Log
        if (!currentSubscriberId || !currentBlogId || duration < MIN_READ_DURATION_SECONDS) {
            console.log('DEBUG: Read tracking skipped due to conditions:', { currentSubscriberId, currentBlogId, duration }); // <-- Debug Log
            return;
        }
        try {
            await trackUserRead(currentSubscriberId, currentBlogId, Math.round(duration));
            console.log(`DEBUG: Read behavior for blog ${currentBlogId} tracked successfully. Duration: ${Math.round(duration)}s`); // <-- Debug Log
        } catch (trackingError) {
            console.error('DEBUG: Failed to track read behavior:', trackingError); // <-- Debug Log
        }
    };


    // --- useEffect for fetching blog data and initializing timer ---
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/blogs/${id}`);
                setBlog(res.data);
                setError(null);

                // Initialize timer if user is subscribed (only track subscribed users' full reads)
                if (hasSubscriberId()) { // Only start timer for subscribed users
                    startTimeRef.current = Date.now();
                    timeSpentRef.current = 0;
                    lastActivityTimeRef.current = Date.now();
                    console.log('DEBUG: Read tracking timer started for blog:', id); // <-- Debug Log
                } else {
                    console.log('DEBUG: Not subscribed, read tracking timer not started for blog:', id); // <-- Debug Log
                }

            } catch (err) {
                console.error("Failed to fetch blog post:", err);
                setError('Failed to load the blog post. Please try again later.');
                setBlog(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBlog();
        }

        // Cleanup function for this useEffect. Send read data if subscribed
        return () => {
            const currentSubscriberId = getSubscriberId();
            const currentBlogId = id;

            // NEW DEBUG LOG
            console.log('DEBUG: useEffect[id] cleanup running for blog:', currentBlogId, 'isSubscribed:', !!currentSubscriberId, 'timeSpent:', timeSpentRef.current / 1000, 'startTimeRef:', startTimeRef.current); // <-- Debug Log

            if (currentSubscriberId && startTimeRef.current && timeSpentRef.current > 0) {
                sendReadTrackingData(currentBlogId, currentSubscriberId, timeSpentRef.current / 1000);
            }
            // Reset refs for next potential mount/fetch
            startTimeRef.current = null;
            timeSpentRef.current = 0;
            lastActivityTimeRef.current = 0;
        };
    }, [id]);

    // --- useEffect for tracking active reading time based on visibility ---
    // Only track if subscribed
    useEffect(() => {
        if (!blog || !startTimeRef.current || !hasSubscriberId()) return; // Only run if blog loaded, timer started, AND subscribed

        const updateTimeSpent = () => {
            const now = Date.now();
            if (document.visibilityState === 'visible') {
                timeSpentRef.current += (now - lastActivityTimeRef.current);
            }
            lastActivityTimeRef.current = now;
        };

        const intervalId = setInterval(updateTimeSpent, 1000);

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                updateTimeSpent();
                console.log('Tab hidden. Current time spent (ms):', timeSpentRef.current);
            } else {
                lastActivityTimeRef.current = Date.now();
                console.log('Tab visible again. Resetting last activity time.');
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(intervalId);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [blog]);

    // --- useEffect to send data on page unload/close (using sendBeacon) ---
    // Only send if subscribed
    useEffect(() => {
        const handleBeforeUnload = () => {
            const currentSubscriberId = getSubscriberId();
            const currentBlogId = id;

            // NEW DEBUG LOG
            console.log('DEBUG: beforeunload event firing for blog:', currentBlogId, 'isSubscribed:', !!currentSubscriberId, 'timeSpent:', timeSpentRef.current / 1000, 'startTimeRef:', startTimeRef.current); // <-- Debug Log

            if (currentSubscriberId && startTimeRef.current && timeSpentRef.current > 0) {
                const duration = Math.round(timeSpentRef.current / 1000);
                if (duration >= MIN_READ_DURATION_SECONDS) {
                    const payload = JSON.stringify({ subscriberId: currentSubscriberId, blogId: currentBlogId, duration });
                    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
                    navigator.sendBeacon(`${API_BASE_URL}/api/track/read`, payload);
                    console.log('DEBUG: Sent read behavior via sendBeacon:', payload); // <-- Debug Log
                } else {
                    console.log('DEBUG: sendBeacon skipped, duration too short for unload:', duration); // <-- Debug Log
                }
            } else {
                console.log('DEBUG: sendBeacon skipped, no subscriber/no start time/no time spent for unload.'); // <-- Debug Log
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [id]);

    // Check subscription status on mount and if it changes (e.g., after subscribing)
    useEffect(() => {
        const updateSubscriptionStatus = () => {
            setIsSubscribed(hasSubscriberId());
        };
        window.addEventListener('storage', updateSubscriptionStatus);
        return () => {
            window.removeEventListener('storage', updateSubscriptionStatus);
        };
    }, []);


    const currentLang = i18n.language;
    const displayTitle = blog ? getLocalizedContent('title', blog, currentLang) : '';
    const displayContent = blog ? getLocalizedContent('content', blog, currentLang) : '';

    // Declare cleanContentHtml and rawContentHtml BEFORE content gating logic
    const rawContentHtml = marked.parse(displayContent);
    const cleanContentHtml = DOMPurify.sanitize(rawContentHtml);

    if (loading) return <div className="text-center mt-20 p-4 dark:text-gray-300">Loading post...</div>;
    if (error) return <div className="text-center mt-20 p-4 text-red-500">{error}</div>;
    if (!blog) return <div className="text-center mt-20 p-4 dark:text-gray-300">Blog post not found.</div>;


    // --- Content Gating Logic ---
    let contentToDisplay = cleanContentHtml; // Default to full content
    let showContentOverlay = false;

    if (!isSubscribed && blog && displayContent) {
        // Truncate content for non-subscribers
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = rawContentHtml;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';

        const effectiveExcerptLength = Math.min(EXCERPT_LENGTH_CHARS, textContent.length);

        if (textContent.length > EXCERPT_LENGTH_CHARS) {
            const excerptText = textContent.substring(0, effectiveExcerptLength);
            contentToDisplay = DOMPurify.sanitize(marked.parse(excerptText));
            showContentOverlay = true;
        } else {
            if (textContent.trim().length > 0) {
                showContentOverlay = true;
            }
        }
    }


    const coverImage = blog.image ? blog.image : 'https://placehold.co/800x400/666/fff?text=No+Image';
    const cleanAltTitle = createSafeAltText(displayTitle);

    return (
        <article className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-xl p-4 sm:p-6 md:p-8 mt-4 md:mt-8 mb-8 relative">
            <img
                src={coverImage}
                alt={cleanAltTitle}
                className="w-full h-auto max-h-[300px] sm:max-h-[400px] object-cover rounded-lg mb-4 md:mb-6 bg-gray-200"
                loading="lazy"
            />

            <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold mb-2 md:mb-3 text-gray-900 dark:text-white leading-tight" style={{ fontFamily: 'Arial, sans-serif' }}>{displayTitle}</h1>
            <div className="flex flex-wrap gap-x-3 gap-y-1 items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 md:mb-8">
                <span>Published on: {new Date(blog.date).toLocaleDateString()}</span>
                <span className="flex items-center gap-1">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.562 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.865.802V10.333z"></path></svg>
                    {blog.likes || 0}
                </span>
                <span className="flex items-center gap-1">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.08-3.242A8.877 8.877 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.72 14.48A6.879 6.879 0 008 15c3.314 0 6-2.686 6-6s-2.686-6-6-6a6.879 6.879 0 00-3.28.52l.995 2.985A.5.5 0 016 7h.5a.5.5 0 01.5.5v.5a.5.5 0 01-.5.5h-.5a.5.5 0 01-.5-.5v-.5a.5.5 0 01.3-.464L4.72 14.48z" clipRule="evenodd"></path></svg>
                    {blog.comments?.length || 0}
                </span>
            </div>

            {/* Main Blog Content Section & Gradient Overlay */}
            <div className={`relative ${showContentOverlay ? 'h-80 overflow-hidden' : ''}`}> {/* Only apply height/overflow if overlay is active */}
                <div
                    className="prose prose-base sm:prose-lg lg:prose-xl dark:prose-invert max-w-none mb-6 md:mb-8
                               prose-img:rounded-xl prose-img:max-h-[400px] prose-img:mx-auto"
                    dangerouslySetInnerHTML={{ __html: isSubscribed ? cleanContentHtml : contentToDisplay }}
                />

                {/* Gradient overlay - now a sibling to the content div, absolutely positioned over it */}
                {showContentOverlay && (
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none"></div>
                )}
            </div>


            {/* Call-to-action overlay for non-subscribers (positioned below the content div) */}
            {showContentOverlay && (
                <div className="flex flex-col items-center justify-center p-4 text-center -mt-16 relative z-10">
                    <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Subscribe to Read Full Article!
                    </p>
                    <button
                        onClick={() => setShowGatedPopup(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-200"
                    >
                        Subscribe Now
                    </button>
                </div>
            )}

            {/* The EmailSubscriptionPopup, rendered conditionally outside the article flow */}
            {showGatedPopup && (
                <EmailSubscriptionPopup
                    showPopup={showGatedPopup}
                    onClose={() => setShowGatedPopup(false)}
                    onSubscribeSuccess={() => {
                        setIsSubscribed(true);
                        setShowGatedPopup(false);
                    }}
                />
            )}


            <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
                {blog.tags?.map((tag) => (
                    <Link
                        key={tag}
                        to={`/tag/${encodeURIComponent(tag.toLowerCase())}`}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 text-sm font-medium rounded-full
                                   hover:bg-blue-200 dark:hover:bg-blue-600 hover:text-blue-700 dark:hover:text-blue-100
                                   transition-colors cursor-pointer"
                    >
                        #{tag}
                    </Link>
                ))}
            </div>

            <div className="border-t dark:border-gray-700 pt-6">
                <div className="mb-8">
                    {/* Like button only visible if subscribed */}
                    {isSubscribed ? (
                        <LikeButton blogId={blog._id} initialLikes={blog.likes} />
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Subscribe to like this post!</p>
                    )}
                </div>
                <Suspense fallback={<div className="text-center py-10 dark:text-gray-400">Loading comments...</div>}>
                    {/* Comment section only visible if subscribed */}
                    {isSubscribed ? (
                        <CommentSection blogId={blog._id} initialComments={blog.comments} />
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Subscribe to view and post comments!</p>
                    )}
                </Suspense>
            </div>
        </article>
    );
};

export default BlogDetail;