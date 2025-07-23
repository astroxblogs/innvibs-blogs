import React from 'react';
import { Link } from 'react-router-dom';
import { marked } from 'marked';
import LikeButton from './LikeButton.jsx';
import { MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BlogCard = ({ blog }) => {
    const { i18n } = useTranslation();
    const currentLang = i18n.language;

    // Function to get the language-specific title and content
    const getLocalizedContent = (field) => {
        const localizedField = blog[`${field}_${currentLang}`];
        if (localizedField) {
            return localizedField;
        }
        if (blog[`${field}_en`]) {
            return blog[`${field}_en`];
        }
        return blog[field] || '';
    };

    const displayTitle = getLocalizedContent('title');
    const displayContent = getLocalizedContent('content');

    // Update the excerpt function to correctly handle Markdown and selected content
    const getPlainTextExcerpt = (markdownContent) => {
        if (!markdownContent) return '';

        const html = marked.parse(markdownContent);

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        let text = tempDiv.textContent || tempDiv.innerText || '';
        text = text.replace(/\s\s+/g, ' ').trim();

        return text.slice(0, 150) + (text.length > 150 ? '...' : '');
    };

    const excerpt = getPlainTextExcerpt(displayContent);

    return (
        <div className="flex flex-col md:flex-row items-stretch bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden w-full">
            {/* Image Section: Order on mobile, fixed width on desktop */}
            {blog.image && (
                <Link to={`/blog/${blog._id}`} className="order-first md:order-last w-full md:w-56 h-48 md:h-auto flex-shrink-0">
                    <img
                        src={blog.image}
                        alt={displayTitle}
                        className="object-cover w-full h-full transition-transform hover:scale-105"
                        loading="lazy"
                    />
                </Link>
            )}

            {/* Content Section: Order on mobile, flex-grow to fill space */}
            <div className="flex-1 p-4 sm:p-5 flex flex-col order-last md:order-first"> {/* Adjusted padding */}
                <div className="flex-grow">
                    <Link to={`/blog/${blog._id}`} className="block">
                        <h2 className="text-xl sm:text-2xl font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-tight"> {/* Adjusted font size, added leading-tight */}
                            {displayTitle}
                        </h2>
                    </Link>
                    <div className="flex flex-wrap gap-2 mb-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{new Date(blog.date).toLocaleDateString()}</span>
                        {blog.tags && blog.tags.map((tag) => (
                            <span key={tag} className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">#{tag}</span>
                        ))}
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4"> {/* Adjusted font size */}
                        {excerpt}
                        {excerpt.length >= 150 && (
                            <Link to={`/blog/${blog._id}`} className="text-blue-500 hover:underline font-semibold ml-1">
                                Read More
                            </Link>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400 text-sm mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <LikeButton blogId={blog._id} initialLikes={blog.likes} />
                    <Link to={`/blog/${blog._id}#comments`} className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <MessageSquare size={16} />
                        <span>{blog.comments?.length || 0}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;