import React, { useRef, useEffect } from 'react';
import BlogCard from './BlogCard';
import { useTranslation } from 'react-i18next';

const BlogList = ({ blogs, loadingMore, hasMore, onLoadMore, totalBlogsCount }) => {
    const { t } = useTranslation();
    const observerRef = useRef(null); // Reference to the last element

    useEffect(() => {
        if (!hasMore || loadingMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    onLoadMore(); // Trigger loading more blogs
                }
            },
            {
                root: null, // viewport
                rootMargin: '0px',
                threshold: 1.0, // 100% visibility
            }
        );

        const currentObserver = observerRef.current;
        if (currentObserver) {
            observer.observe(currentObserver);
        }

        return () => {
            if (currentObserver) observer.unobserve(currentObserver);
        };
    }, [hasMore, loadingMore, onLoadMore]);

    if (!blogs.length && !loadingMore) {
        return <div className="text-center text-gray-500 mt-10">{t('no blogs found')}</div>;
    }

    return (
        <div className="max-w-4xl w-full mx-auto px-4">
            <div className="grid grid-cols-1 gap-6">
                {blogs.map((blog, index) => {
                    // Attach the observer to the last blog card
                    const isLast = index === blogs.length - 1;
                    return (
                        <div key={blog._id} ref={isLast ? observerRef : null}>
                            <BlogCard blog={blog} />
                        </div>
                    );
                })}
            </div>

            {loadingMore && (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    {t('loading blogs....')}
                </div>
            )}
        </div>
    );
};

export default BlogList;
