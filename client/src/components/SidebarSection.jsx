import React from 'react';
import { Link } from 'react-router-dom';

const SidebarSection = ({ title, items = [], onViewMore }) => {
    if (!items || items.length === 0) return null;
    return (
        <aside className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide font-sans">
                    {title}
                </h3>
                <button onClick={onViewMore} className="text-xs text-violet-600 hover:underline">View More</button>
            </div>
            <ul className="space-y-4">
                {items.map((blog) => (
                    <li key={blog._id} className="flex gap-3 items-start">
                        {blog.image && (
                            <Link to={`/blog/${blog._id}`} className="flex-shrink-0">
                                <img src={blog.image} alt={blog.title} className="w-16 h-12 object-cover rounded" loading="lazy" />
                            </Link>
                        )}
                        <Link to={`/blog/${blog._id}`} className="text-sm text-gray-800 dark:text-gray-200 leading-snug line-clamp-2 hover:underline">
                            {blog.title_en || blog.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default SidebarSection;


