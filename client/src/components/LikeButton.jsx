import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThumbsUp } from 'lucide-react';

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
        if (liked) return;

        setLiked(true);
        setLikes(prevLikes => prevLikes + 1);
        setError(null);

        try {
            await axios.post(`/api/blogs/${blogId}/like`);

            // 2. After a successful like, save it to localStorage
            const likedBlogsJSON = localStorage.getItem('likedBlogs');
            const likedBlogs = likedBlogsJSON ? JSON.parse(likedBlogsJSON) : [];

            // Add the new blog ID and save it back to storage
            localStorage.setItem('likedBlogs', JSON.stringify([...likedBlogs, blogId]));

        } catch (err) {
            setError('Failed to like post.');
            setLiked(false);
            setLikes(prevLikes => prevLikes - 1);
            console.error("Failed to like the post:", err);
        }
    };

    return (
        <button
            onClick={handleLike}
            disabled={liked} // The button is disabled if it's already liked
            className={`flex items-center gap-1.5 transition-colors duration-200 ${liked
                    ? 'text-blue-600 font-semibold cursor-not-allowed'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
            aria-label="Like this post"
        >
            <ThumbsUp size={16} fill={liked ? 'currentColor' : 'none'} />
            <span>{likes}</span>
            {error && <span className="text-red-500 text-xs ml-2">{error}</span>}
        </button>
    );
};

export default LikeButton;