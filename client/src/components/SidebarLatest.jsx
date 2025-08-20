import React from 'react';
import { Link } from 'react-router-dom';
import { getCategoryClasses } from '../utils/categoryColors';

const SidebarLatest = ({ title = 'Latest Updates', items = [] }) => {
    if (!items || items.length === 0) return null;
    return (
        <aside className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4">
            <div className="inline-block bg-black text-white px-3 py-2 rounded font-sans text-sm tracking-wide uppercase mb-4">
                {title}
            </div>
            <ul>
                {items.map((blog, idx) => (
                    <li key={blog._id} className="mb-6 last:mb-0">
                        <Link to={`/blog/${blog._id}`} className="block">
                            {blog.image && (
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-44 sm:h-48 object-cover rounded"
                                    loading="lazy"
                                />
                            )}
                        </Link>
                        <Link
                            to={`/blog/${blog._id}`}
                            className="mt-3 block font-sans text-[15px] sm:text-base md:text-[17px] leading-relaxed font-medium text-gray-900 dark:text-gray-100 hover:underline line-clamp-3"
                        >
                            {blog.title_en || blog.title}
                        </Link>
                        {idx !== items.length - 1 && (
                            <>
                                <div className="mt-2 flex items-center gap-2 text-[11px]">
                                    {blog.category && (
                                        <span className={`px-2 py-0.5 rounded-full ${getCategoryClasses(blog.category)}`}>
                                            {blog.category}
                                        </span>
                                    )}
                                    <span className="text-gray-500 dark:text-gray-400">{new Date(blog.date).toLocaleDateString()}</span>
                                </div>
                                <div className="mt-4 border-b border-gray-200 dark:border-gray-800" />
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default SidebarLatest;


