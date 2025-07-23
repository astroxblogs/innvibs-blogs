import React from 'react';
import BlogCard from './BlogCard';
import { useTranslation } from 'react-i18next';

// BlogList now accepts pagination props
const BlogList = ({ blogs, loadingMore, hasMore, onLoadMore, totalBlogsCount }) => {
    const { t } = useTranslation();

    // Corrected translation key usage for "No blogs found"
    if (!blogs.length && !loadingMore) {
        return <div className="text-center text-gray-500 mt-10">{t('No Blogs Found')}</div>;
    }

    return (
        <div className="max-w-4xl w-full mx-auto px-4">
            {/* REMOVED: Display count (general.showing_blogs_count) as per your request */}
            {/* {totalBlogsCount > 0 && (
                <p className="text-right text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {t('general.showing_blogs_count', {
                        currentCount: blogs.length,
                        totalCount: totalBlogsCount
                    })}
                </p>
            )} */}

            <div className="grid grid-cols-1 gap-6">
                {blogs.map((blog) => (
                    <BlogCard key={blog._id} blog={blog} />
                ))}
            </div>

            {hasMore && (
                <div className="text-center mt-8">
                    <button
                        onClick={onLoadMore}
                        disabled={loadingMore}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {/* Corrected translation keys */}
                        {loadingMore ? t('general.loading_more') : t('general.load_more')}
                    </button>
                </div>
            )}

            {loadingMore && (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    {/* Corrected translation key for loading message */}
                    {t('general.loading_blogs_dot_dot_dot')}
                </div>
            )}
        </div>
    );
};

export default BlogList;