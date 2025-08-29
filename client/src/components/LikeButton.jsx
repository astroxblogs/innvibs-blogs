// client/src/components/LikeButton.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThumbsUp } from 'lucide-react';

// NEW: Import getSubscriberId and trackUserLike
import { getSubscriberId } from '../utils/localStorage'; // <-- ADD THIS LINE
import { trackUserLike } from '../services/api';     // <-- ADD THIS LINE

const LikeButton = ({ blogId, initialLikes = 0 }) => {
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(false);
    const [error, setError] = useState(null);

    // 1. Check localStorage when the component first loads
    useEffect(() => {
        // Get the list of liked blogs from storage
        const likedBlogsJSON = localStorage.getItem('likedBlogs');
        const likedBlogs = likedBlogsJSON ? JSON.parse(likedBlogsJSON) : [];

        // If this blog's ID is in the list, set the button to a "liked" state
        if (likedBlogs.includes(blogId)) {
            setLiked(true);
        }
    }, [blogId]); // This effect runs whenever the blogId changes

    // Sync the like count if the initial prop changes
    useEffect(() => {
        setLikes(initialLikes);
    }, [initialLikes]);

    const handleLike = async () => {
        // Optimistically update UI
        const newLikedState = !liked;
        setLiked(newLikedState);
        setLikes(prevLikes => newLikedState ? prevLikes + 1 : Math.max(0, prevLikes - 1));
        setError(null);

        try {
            // Send like/unlike to the main blog backend to update the like count
            const endpoint = newLikedState ? 'like' : 'unlike';
            await axios.post(`/api/blogs/${blogId}/${endpoint}`);

            // Update localStorage for local state persistence
            const likedBlogsJSON = localStorage.getItem('likedBlogs');
            let likedBlogs = likedBlogsJSON ? JSON.parse(likedBlogsJSON) : [];

            if (newLikedState) {
                // Add the blog ID if not already present
                if (!likedBlogs.includes(blogId)) {
                    likedBlogs.push(blogId);
                }
            } else {
                // Remove the blog ID
                likedBlogs = likedBlogs.filter(id => id !== blogId);
            }
            
            localStorage.setItem('likedBlogs', JSON.stringify(likedBlogs));

            // Track user behavior for inferred interests (only when liking)
            if (newLikedState) {
                const subscriberId = getSubscriberId();
                if (subscriberId) {
                    try {
                        await trackUserLike(subscriberId, blogId);
                        console.log(`Like behavior for blog ${blogId} tracked for subscriber:`, subscriberId);
                    } catch (trackingError) {
                        console.error('Failed to track like for personalization:', trackingError);
                    }
                }
            }

        } catch (err) {
            setError(newLikedState ? 'Failed to like post.' : 'Failed to unlike post.');
            setLiked(!newLikedState); // Revert UI on error
            setLikes(prevLikes => newLikedState ? Math.max(0, prevLikes - 1) : prevLikes + 1); // Revert likes count on error
            console.error(`Failed to ${newLikedState ? 'like' : 'unlike'} the post:`, err);

            // Revert localStorage if the operation failed on the server
            const likedBlogsJSON = localStorage.getItem('likedBlogs');
            let likedBlogs = likedBlogsJSON ? JSON.parse(likedBlogsJSON) : [];
            if (newLikedState) {
                likedBlogs = likedBlogs.filter(id => id !== blogId);
            } else {
                if (!likedBlogs.includes(blogId)) {
                    likedBlogs.push(blogId);
                }
            }
            localStorage.setItem('likedBlogs', JSON.stringify(likedBlogs));
        }
    };

    return (
        <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-colors duration-200 ${liked
                ? 'text-blue-600 font-semibold hover:text-blue-700'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
            aria-label={liked ? "Unlike this post" : "Like this post"}
        >
            <ThumbsUp size={16} fill={liked ? 'currentColor' : 'none'} />
            <span>{likes}</span>
            {error && <span className="text-red-500 text-xs ml-2">{error}</span>}
        </button>
    );
};

export default LikeButton;