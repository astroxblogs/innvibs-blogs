import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
    // Function to strip HTML tags and get plain text for the excerpt
    const getPlainTextExcerpt = (htmlContent) => {
        if (!htmlContent) return '';
        // Create a temporary div to parse the HTML and extract text
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        // Get text content, remove multiple spaces/newlines, and trim
        let text = tempDiv.textContent || tempDiv.innerText || '';
        text = text.replace(/\s\s+/g, ' ').trim(); // Replace multiple spaces with single space
        return text.slice(0, 120) + (text.length > 120 ? '...' : '');
    };

    return (
        <div className="flex flex-col md:flex-row items-stretch bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow mb-6 overflow-hidden w-full">

            {/* Left: Text */}
            <div className="flex-1 p-5 flex flex-col justify-between max-w-full w-full">
                <div>
                    <Link to={`/blog/${blog._id}`} className="block">
                        <h2 className="text-2xl font-bold mb-2 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">{blog.title}</h2>
                    </Link>
                    <div className="flex flex-wrap gap-2 mb-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{new Date(blog.date).toLocaleDateString()}</span>
                        {blog.tags && blog.tags.map((tag) => (
                            <span key={tag} className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">#{tag}</span>
                        ))}
                    </div>
                    {/* Use dangerouslySetInnerHTML for the main blog content if you want rich text here
                        However, for a card excerpt, plain text is usually better.
                        The original code was trying to show an excerpt, so we'll adjust for that.
                    */}
                    <p className="text-gray-700 dark:text-gray-200 mb-4 line-clamp-2">
                        {getPlainTextExcerpt(blog.content)}
                    </p>
                </div>
                <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm mt-auto">
                    <span className="flex items-center gap-1">
                        <span className="material-icons text-base">thumb_up</span> {blog.likes || 0}
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="material-icons text-base">comment</span> {blog.comments?.length || 0}
                    </span>
                </div>
            </div>

            {/* Right: Image */}
            {blog.image && (
                <Link to={`/blog/${blog._id}`} className="w-full md:w-56 h-40 md:h-auto flex-shrink-0 max-w-full">
                    <img src={blog.image} alt={blog.title} className="object-cover w-full max-w-full h-full md:h-auto transition-transform group-hover:scale-105 duration-200" style={{ height: '100%', width: '100%', maxWidth: '100%' }} />
                </Link>
            )}
        </div>
    );
};

export default BlogCard;