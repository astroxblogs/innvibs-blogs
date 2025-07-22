import React from 'react';
import BlogCard from './BlogCard';
import { useTranslation } from 'react-i18next';

// BlogList now accepts pagination props
const BlogList = ({ blogs, loadingMore, hasMore, onLoadMore, totalBlogsCount }) => {
    const { t } = useTranslation();

    if (!blogs.length && !loadingMore) { // Only show 'no blogs' if not currently loading more
        return <div className="text-center text-gray-500 mt-10">{t('general.no_blogs_found')}</div>;
    }

    return (
        <div className="max-w-4xl w-full mx-auto px-4">
            {/* Display count if there are blogs */}
            {totalBlogsCount > 0 && (
                <p className="text-right text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {t('general.showing_blogs_count', {
                        currentCount: blogs.length,
                        totalCount: totalBlogsCount
                    })}
                </p>
            )}

            <div className="grid grid-cols-1 gap-6"> {/* Added a grid layout for better spacing of cards */}
                {blogs.map((blog) => (
                    <BlogCard key={blog._id} blog={blog} />
                ))}
            </div>

            {hasMore && ( // Only show 'Load More' if there are more pages
                <div className="text-center mt-8">
                    <button
                        onClick={onLoadMore}
                        disabled={loadingMore} // Disable button while loading
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loadingMore ? t('loading_more') : t('load more....')}
                    </button>
                </div>
            )}

            {loadingMore && ( // Show a loading indicator when more blogs are being fetched
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    {t('No blogs are Found')}
                </div>
            )}
        </div>
    );
};

export default BlogList;