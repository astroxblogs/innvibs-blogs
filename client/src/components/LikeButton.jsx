import React, { useState } from 'react';

const LikeButton = ({ blogId, initialLikes = 0 }) => {
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(false);

    const handleLike = () => {
        if (!liked) {
            setLikes((prev) => prev + 1);
            setLiked(true);

            // Optional: send like to backend
            // fetch(`/api/blogs/${blogId}/like`, { method: 'POST' });
        }
    };

    return (
        <button
            onClick={handleLike}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
            <span className="material-icons">thumb_up</span>
            <span>{likes}</span>
        </button>
    );
};

export default LikeButton;
