import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import BlogList from '../components/BlogList';
import FeaturedBlogCarousel from '../components/FeaturedBlogCarousel';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const INITIAL_PAGE_SIZE = 6;

const Home = ({ activeCategory, searchQuery }) => {
    const { t } = useTranslation();

    const [blogs, setBlogs] = useState([]);
    const [featuredBlogs, setFeaturedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBlogsCount, setTotalBlogsCount] = useState(0);

    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    };

    const taglineVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.8, ease: "easeOut" } },
    };

    useEffect(() => {
        const fetchFeaturedBlogs = async () => {
            try {
                const res = await axios.get('/api/blogs/latest');
                setFeaturedBlogs(res.data);
            } catch (err) {
                console.error("Error fetching featured blogs:", err);
            }
        };

        fetchFeaturedBlogs();
    }, []);

    const fetchBlogs = useCallback(async (pageToLoad = 1, append = false) => {
        if (pageToLoad === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            let url = `/api/blogs?page=${pageToLoad}&limit=${INITIAL_PAGE_SIZE}`;

            if (searchQuery) {
                url = `/api/blogs/search?q=${encodeURIComponent(searchQuery)}&page=${pageToLoad}&limit=${INITIAL_PAGE_SIZE}`;
            } else if (activeCategory && activeCategory !== 'all') {
                url = `/api/blogs?category=${activeCategory}&page=${pageToLoad}&limit=${INITIAL_PAGE_SIZE}`;
            }

            const res = await axios.get(url);
            const { blogs: newBlogs, currentPage: apiCurrentPage, totalPages: apiTotalPages, totalBlogs: apiTotalBlogs } = res.data;

            if (append) {
                setBlogs(prevBlogs => [...prevBlogs, ...newBlogs]);
            } else {
                setBlogs(newBlogs);
            }
            setCurrentPage(apiCurrentPage);
            setTotalPages(apiTotalPages);
            setTotalBlogsCount(apiTotalBlogs);
        } catch (err) {
            console.error("Error fetching blogs:", err);
            setBlogs([]);
            setTotalPages(0);
            setTotalBlogsCount(0);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [activeCategory, searchQuery]);

    useEffect(() => {
        fetchBlogs(1, false);
    }, [fetchBlogs]);

    const loadMoreBlogs = () => {
        if (currentPage < totalPages && !loadingMore) {
            fetchBlogs(currentPage + 1, true);
        }
    };

    const isSearchView = !!searchQuery;
    const isCategoryView = activeCategory && activeCategory !== 'all';

    let pageTitle = '';
    if (isSearchView) {
        pageTitle = t('general.search_results_for', { query: searchQuery });
    } else if (isCategoryView) {
        pageTitle = t('general.blogs_in_category', { category: activeCategory });
    }

    if (loading) {
        return <div className="text-center py-20 dark:text-gray-200">{t('general.loading_blogs')}</div>; // Use general.loading_blogs
    }

    const showFeaturedPostsHeader = !isSearchView && !isCategoryView;
    const showDynamicPageTitle = isSearchView || isCategoryView;
    const hasBlogsToDisplay = blogs.length > 0;

    return (
        <div className="min-h-screen">
            {!isSearchView && !isCategoryView && featuredBlogs.length > 0 && (
                <FeaturedBlogCarousel blogs={featuredBlogs} />
            )}

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"> {/* Adjusted horizontal padding and vertical padding */}
                {!isSearchView && !isCategoryView && (
                    <div className="text-center mb-12 mt-6 md:mb-16 md:mt-8"> {/* Adjusted margins for better mobile spacing */}
                        <motion.h1
                            className="text-3xl md:text-5xl font-extrabold mb-3 md:mb-4 text-gray-900 dark:text-white leading-tight" // Adjusted font size for mobile, tighter leading
                            variants={textVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {t('homepage.welcome_title')}
                        </motion.h1>
                        <motion.p
                            className="text-lg md:text-2xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto px-2" // Adjusted font size for mobile, added horizontal padding
                            variants={taglineVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {t('homepage.tagline')}
                        </motion.p>
                    </div>
                )}

                {showFeaturedPostsHeader && (
                    <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-900 dark:text-white text-center md:text-left"> {/* Adjusted font size for mobile */}
                        {t('homepage.featured_posts')}
                    </h2>
                )}

                {showDynamicPageTitle && (
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white capitalize text-center md:text-left"> {/* Adjusted font size for mobile */}
                        {pageTitle}
                    </h2>
                )}

                <BlogList
                    blogs={blogs}
                    loadingMore={loadingMore}
                    hasMore={currentPage < totalPages}
                    onLoadMore={loadMoreBlogs}
                    totalBlogsCount={totalBlogsCount}
                />

                {!hasBlogsToDisplay && !loading && (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                        {t('general.no_blogs_found')}
                    </p>
                )}
            </main>
        </div>
    );
};

export default Home;