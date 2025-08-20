import React from 'react';
import { Link } from 'react-router-dom';
import { marked } from 'marked';
import LikeButton from './LikeButton.jsx';
import { MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getCategoryClasses } from '../utils/categoryColors';

const BlogCard = ({ blog }) => {
    const { i18n } = useTranslation();
    const currentLang = i18n.language;

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
        <div className="flex items-stretch bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow transition overflow-hidden w-full">
            {blog.image && (
                <Link to={`/blog/${blog._id}`} className="w-32 sm:w-40 md:w-48 h-28 sm:h-32 md:h-32 flex-shrink-0">
                    <img
                        src={blog.image}
                        alt={displayTitle}
                        className="object-cover w-full h-full"
                        loading="lazy"
                    />
                </Link>
            )}

            <div className="flex-1 p-3 sm:p-4">
                <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-1">
                    {blog.category && (
                        <span className={`px-2 py-0.5 rounded-full ${getCategoryClasses(blog.category)}`}>
                            {blog.category}
                        </span>
                    )}
                    <span>{new Date(blog.date).toLocaleDateString()}</span>
                    {blog.tags && blog.tags.slice(0, 2).map((tag) => (
                        <Link
                            key={tag}
                            to={`/tag/${encodeURIComponent(tag.toLowerCase())}`}
                            className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-violet-100 hover:text-violet-700"
                        >
                            #{tag}
                        </Link>
                    ))}
                </div>

                <Link to={`/blog/${blog._id}`} className="block">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold leading-snug hover:text-violet-700 dark:hover:text-violet-400">
                        {displayTitle}
                    </h2>
                </Link>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {excerpt}
                </p>

                <div className="mt-3 flex items-center gap-5 text-gray-500 dark:text-gray-400 text-xs">
                    <LikeButton blogId={blog._id} initialLikes={blog.likes} />
                    <Link to={`/blog/${blog._id}#comments`} className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white">
                        <MessageSquare size={14} />
                        <span>{blog.comments?.length || 0}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;