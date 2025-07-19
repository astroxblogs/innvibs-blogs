import React from 'react';
import { Link } from 'react-router-dom';
import LikeButton from './LikeButton.jsx'; // 1. Import the LikeButton
import { MessageSquare } from 'lucide-react'; // A matching icon for comments

const BlogCard = ({ blog }) => {
    // Function to strip HTML tags and get a plain text excerpt
    const getPlainTextExcerpt = (htmlContent) => {
        if (!htmlContent) return '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        let text = tempDiv.textContent || tempDiv.innerText || '';
        text = text.replace(/\s\s+/g, ' ').trim();
        return text.slice(0, 150);
    };

    const excerpt = getPlainTextExcerpt(blog.content);

    return (
        <div className="flex flex-col md:flex-row items-stretch bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow mb-6 overflow-hidden w-full">
            {/* Left: Text Content */}
            <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                    <Link to={`/blog/${blog._id}`} className="block">
                        <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{blog.title}</h2>
                    </Link>
                    <div className="flex flex-wrap gap-2 mb-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{new Date(blog.date).toLocaleDateString()}</span>
                        {blog.tags && blog.tags.map((tag) => (
                            <span key={tag} className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">#{tag}</span>
                        ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {excerpt}
                        {blog.content && blog.content.length > 150 && (
                            <>
                                ...
                                <Link to={`/blog/${blog._id}`} className="text-blue-500 hover:underline font-semibold ml-1">
                                    Read More
                                </Link>
                            </>
                        )}
                    </p>
                </div>

                {/* === UPDATED SECTION === */}
                <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400 text-sm mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {/* 2. Replace the old span with the new LikeButton component */}
                    <LikeButton blogId={blog._id} initialLikes={blog.likes} />

                    <Link to={`/blog/${blog._id}#comments`} className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <MessageSquare size={16} />
                        <span>{blog.commentCount || blog.comments?.length || 0}</span>
                    </Link>
                </div>
            </div>

            {/* Right: Image */}
            {blog.image && (
                <Link to={`/blog/${blog._id}`} className="w-full md:w-56 h-48 md:h-auto flex-shrink-0">
                    <img src={blog.image} alt={blog.title} className="object-cover w-full h-full transition-transform hover:scale-105" />
                </Link>
            )}
        </div>
    );
};

export default BlogCard;