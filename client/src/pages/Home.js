import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BlogList from '../components/BlogList';
import FeaturedBlogCarousel from '../components/FeaturedBlogCarousel';

// The component receives activeCategory and searchQuery from App.js to determine what to display.
const Home = ({ activeCategory, searchQuery }) => {
    const [blogs, setBlogs] = useState([]); // For the main list of blogs
    const [featuredBlogs, setFeaturedBlogs] = useState([]); // For the carousel
    const [loading, setLoading] = useState(true);

    // Effect to fetch the 5 latest blogs for the carousel.
    // This runs only once when the component first mounts.
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
    }, []); // Empty dependency array ensures this runs only once.

    // Effect to fetch the main list of blogs.
    // This re-runs whenever the active category or search query changes.
    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                let url = '/api/blogs'; // Default URL for all blogs

                if (searchQuery) {
                    // If searching, use the search endpoint
                    url = `/api/blogs/search?q=${encodeURIComponent(searchQuery)}`;
                } else if (activeCategory && activeCategory !== 'all') { // Assuming 'all' is for the main page
                    // If a category is selected, filter by that category
                    url = `/api/blogs?category=${activeCategory}`;
                }

                const res = await axios.get(url);
                setBlogs(res.data);
            } catch (err) {
                console.error("Error fetching blogs:", err);
                setBlogs([]); // Clear blogs on error
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [activeCategory, searchQuery]); // Re-fetch when these props change.

    // Determine the current view to adjust UI elements like the title
    const isSearchView = !!searchQuery;
    const isCategoryView = activeCategory && activeCategory !== 'all';

    // The page title is now dynamic based on the view
    const pageTitle = isSearchView
        ? `Search Results for "${searchQuery}"`
        : isCategoryView
            ? `Blogs in #${activeCategory}`
            : 'Latest Blogs';

    if (loading) {
        return <div className="text-center py-20 dark:text-gray-200">Loading blogs...</div>;
    }

    return (
        <div className="min-h-screen">
            {/* The carousel only shows on the main home page (not in search or category views) */}
            {!isSearchView && !isCategoryView && featuredBlogs.length > 0 && (
                <FeaturedBlogCarousel blogs={featuredBlogs} />
            )}

            <main className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white capitalize">
                    {pageTitle}
                </h2>

                <BlogList blogs={blogs} />

                {blogs.length === 0 && !loading && (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                        No blogs found.
                    </p>
                )}
            </main>
        </div>
    );
};

export default Home;