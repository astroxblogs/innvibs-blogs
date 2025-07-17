import React from 'react';
import BlogCard from './BlogCard';
import { useTranslation } from 'react-i18next';

const BlogList = ({ blogs }) => {
    const { t } = useTranslation();
    if (!blogs.length) return <div className="text-center text-gray-500 mt-10">{t('no_blogs')}</div>;
    return (
        <div className="max-w-4xl w-full mx-auto px-4">
            {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
            ))}
        </div>

    );
};

export default BlogList;