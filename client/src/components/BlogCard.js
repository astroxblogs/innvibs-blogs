import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BlogCard = ({ blog }) => {
    const { i18n } = useTranslation(); // Hook to get language info
    const currentLang = i18n.language;

    // --- Select content based on the current language, with English as a fallback ---
    const title = blog.title[currentLang] || blog.title.en;
    const contentHtml = blog.content[currentLang] || blog.content.en;

    // --- Use the first image from the 'images' array as the thumbnail ---
    const thumbnailUrl = blog.images && blog.images.length > 0
        ? blog.images[0]
        : 'https://placehold.co/400x300?text=Blog'; // Fallback image

    // Function to strip HTML tags and get a plain text excerpt
    const getPlainTextExcerpt = (htmlContent) => {
        if (!htmlContent) return '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        let text = tempDiv.textContent || tempDiv.innerText || '';
        text = text.replace(/\s\s+/g, ' ').trim();
        // Return a truncated version for the card
        return text.length > 150 ? text.substring(0, 150) + '...' : text;
    };

    const excerpt = getPlainTextExcerpt(contentHtml);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col group">
            <Link to={`/blog/${blog._id}`} className="block">
                <img
                    src={thumbnailUrl}
                    alt={title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    // Add an onerror handler for broken image links
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300?text=Image+Error'; }}
                />
            </Link>

            <div className="p-5 flex flex-col flex-grow">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-2">
                    {blog.tags && blog.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Title */}
                <Link to={`/blog/${blog._id}`} className="block">
                    <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {title}
                    </h2>
                </Link>

                {/* Excerpt */}
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm flex-grow">
                    {excerpt}
                </p>

                {/* Footer with date and stats */}
                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>{new Date(blog.date).toLocaleDateString()}</span>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.562 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.865.802V10.333z"></path></svg>
                            {blog.likes || 0}
                        </span>
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.08-3.242A8.877 8.877 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.72 14.48A6.879 6.879 0 008 15c3.314 0 6-2.686 6-6s-2.686-6-6-6a6.879 6.879 0 00-3.28.52l.995 2.985A.5.5 0 016 7h.5a.5.5 0 01.5.5v.5a.5.5 0 01-.5.5h-.5a.5.5 0 01-.5-.5v-.5a.5.5 0 01.3-.464L4.72 14.48z" clipRule="evenodd"></path></svg>
                            {blog.comments?.length || 0}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
