
import React from 'react';
import { Link } from 'react-router-dom';
import { marked } from 'marked';
import LikeButton from './LikeButton.jsx';
import { MessageSquare, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getCategoryClasses } from '../utils/categoryColors';

const BlogCard = ({ blog }) => {
    const { i18n, t } = useTranslation();
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
        <div className="flex flex-col sm:flex-row items-stretch bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow transition overflow-hidden w-full">
            {blog.image && (
                <Link to={`/blog/${blog._id}`} className="w-full aspect-[16/9] sm:w-40 md:w-48 sm:aspect-auto sm:self-stretch flex-shrink-0 overflow-hidden group">
                    <img
                        src={blog.image}
                        alt={displayTitle}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                    />
                </Link>
            )}

            <div className="flex-1 p-3 sm:p-4">
                {/* Meta row: category + date */}
                <div className="flex items-center gap-2 flex-wrap text-[11px] text-gray-500 mb-1">
                    {blog.category && (
                        <span className={`px-2 py-0.5 rounded-full ${getCategoryClasses(blog.category)}`}>
                            {t(`category.${String(blog.category).toLowerCase().replace(/ & /g, '_').replace(/\s+/g, '_')}`, { defaultValue: blog.category })}
                        </span>
                    )}
                    <span className="text-gray-500 dark:text-gray-400">{new Date(blog.date).toLocaleDateString()}</span>
                </div>

                {/* Title */}
                <Link to={`/blog/${blog._id}`} className="block">
                    <h2 className="text-sm sm:text-lg md:text-xl font-semibold leading-snug text-gray-900 dark:text-gray-100 hover:underline line-clamp-2">
                        {displayTitle}
                    </h2>
                </Link>

                {/* Tags row */}
                {blog.tags && blog.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                        {blog.tags.slice(0, 3).map((tag) => (
                            <Link
                                key={tag}
                                to={`/tag/${encodeURIComponent(tag.toLowerCase())}`}
                                className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                #{tag}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Excerpt */}
                <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {excerpt}
                </p>

                <div className="mt-2 flex items-center gap-4 sm:gap-5 text-gray-500 dark:text-gray-400 text-[11px] sm:text-xs">
                    <LikeButton blogId={blog._id} initialLikes={blog.likes} />
                    <Link to={`/blog/${blog._id}#comments`} className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white">
                        <MessageSquare size={14} />
                        <span>{blog.comments?.length || 0}</span>
                    </Link>
                    <span className="ml-auto flex items-center gap-1.5">
                        <Eye size={14} />
                        <span>{blog.views || 0}</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;



