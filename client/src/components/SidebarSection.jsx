
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SidebarSection = ({ title, items = [], onViewMore }) => {
    const { i18n, t } = useTranslation();
    const currentLang = i18n.language;

    const getLocalized = (blog, field) => {
        const localized = blog[`${field}_${currentLang}`];
        if (localized) return localized;
        if (blog[`${field}_en`]) return blog[`${field}_en`];
        return blog[field] || '';
    };
    if (!items || items.length === 0) return null;
    return (
        <aside className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide font-sans">
                    {currentLang === 'hi'
                        ? t(`category.${title.toLowerCase().replace(/ & /g, '_').replace(/\s+/g, '_')}`, { defaultValue: title })
                        : title}
                </h3>
                <button onClick={onViewMore} className="text-xs text-violet-600 hover:underline">{t('general.view_more')}</button>
            </div>
            <ul className="space-y-4">
                {items.map((blog) => (
                    <li key={blog._id} className="flex gap-3 items-start">
                        {blog.image && (
                            <Link to={`/blog/${blog._id}`} className="flex-shrink-0">
                                <img src={blog.image} alt={getLocalized(blog, 'title')} className="w-16 h-12 object-cover rounded" loading="lazy" />
                            </Link>
                        )}
                        <Link to={`/blog/${blog._id}`} className="text-sm text-gray-800 dark:text-gray-200 leading-snug line-clamp-2 hover:underline">
                            {getLocalized(blog, 'title')}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default SidebarSection;





