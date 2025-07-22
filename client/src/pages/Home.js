import React, { useEffect, useState, useCallback } from 'react'; // Added useCallback
import axios from 'axios';
import BlogList from '../components/BlogList';
import FeaturedBlogCarousel from '../components/FeaturedBlogCarousel';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const INITIAL_PAGE_SIZE = 6;  

const Home = ({ activeCategory, searchQuery }) => {
    const { t } = useTranslation();

    const [blogs, setBlogs] = useState([]); // Stores all loaded blogs
    const [featuredBlogs, setFeaturedBlogs] = useState([]);
    const [loading, setLoading] = useState(true); // Initial loading state for first page
    const [loadingMore, setLoadingMore] = useState(false); // State for subsequent 'Load More' clicks
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBlogsCount, setTotalBlogsCount] = useState(0); // To keep track of overall total

    // Animation variants for the welcome text and tagline
    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    };

    const taglineVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.8, ease: "easeOut" } },
    };

    // Effect to fetch the 5 latest blogs for the carousel.
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

    // Main blog fetching logic, now with pagination
    const fetchBlogs = useCallback(async (pageToLoad = 1, append = false) => {
        if (pageToLoad === 1) {
            setLoading(true); // Show full loading spinner for first page load
        } else {
            setLoadingMore(true); // Show small spinner for 'Load More'
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
                setBlogs(newBlogs); // Replace blogs for new search/category
            }
            setCurrentPage(apiCurrentPage);
            setTotalPages(apiTotalPages);
            setTotalBlogsCount(apiTotalBlogs);
        } catch (err) {
            console.error("Error fetching blogs:", err);
            setBlogs([]); // Clear blogs on error
            setTotalPages(0);
            setTotalBlogsCount(0);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [activeCategory, searchQuery]); // Dependencies: re-fetch from page 1 if category/search changes

    // Effect to trigger initial fetch or re-fetch on category/search change
    useEffect(() => {
        fetchBlogs(1, false); // Always start from page 1 when category or search query changes
    }, [fetchBlogs]); // Dependency on fetchBlogs memoized function

    // Function to load the next page of blogs
    const loadMoreBlogs = () => {
        if (currentPage < totalPages && !loadingMore) {
            fetchBlogs(currentPage + 1, true); // Fetch next page, append to existing blogs
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
        return <div className="text-center py-20 dark:text-gray-200">{t('Loading blogs')}</div>;
    }

    // Determine if "Featured Posts" or the dynamic pageTitle should be displayed
    const showFeaturedPostsHeader = !isSearchView && !isCategoryView;
    const showDynamicPageTitle = isSearchView || isCategoryView;
    const hasBlogsToDisplay = blogs.length > 0;

    return (
        <div className="min-h-screen">
            {!isSearchView && !isCategoryView && featuredBlogs.length > 0 && (
                <FeaturedBlogCarousel blogs={featuredBlogs} />
            )}

            <main className="container mx-auto px-4 py-8">
                {!isSearchView && !isCategoryView && (
                    <div className="text-center mb-16 mt-8">
                        <motion.h1
                            className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white"
                            variants={textVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {t('homepage.welcome_title')}
                        </motion.h1>
                        <motion.p
                            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                            variants={taglineVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {t('homepage.tagline')}
                        </motion.p>
                    </div>
                )}

                {showFeaturedPostsHeader && (
                    <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white text-center md:text-left">
                        {t('homepage.featured_posts')}
                    </h2>
                )}

                {showDynamicPageTitle && (
                    <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white capitalize text-center md:text-left">
                        {pageTitle}
                    </h2>
                )}

                {/* Always pass the loadMore function and pagination status to BlogList */}
                {/* BlogList will decide whether to show the "Load More" button */}
                <BlogList
                    blogs={blogs}
                    loadingMore={loadingMore}
                    hasMore={currentPage < totalPages}
                    onLoadMore={loadMoreBlogs}
                    totalBlogsCount={totalBlogsCount} // Pass total count for "X of Y blogs"
                />

                {!hasBlogsToDisplay && !loading && (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                        {t('No blogs found')}
                    </p>
                )}
            </main>
        </div>
    );
};

export default Home;