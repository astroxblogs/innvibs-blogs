// client/src/pages/Home.js
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

// Import your new FeaturedBlogCarousel component
import { useTranslation } from 'react-i18next';
import BlogList from '../components/BlogList';
import FeaturedBlogCarousel from '../components/FeaturedBlogCarousel' // Keep your existing BlogList

const Home = ({ activeCategory }) => {
    const { i18n } = useTranslation();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state for better UX

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.get(`/api/blogs`);
                // Sort blogs by date in descending order (newest first) to ensure latest are featured
                const sortedBlogs = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setBlogs(sortedBlogs);
            } catch (err) {
                console.error("Error fetching blogs:", err);
                setBlogs([]); // Set to empty array on error
            } finally {
                setLoading(false); // Set loading to false regardless of success or failure
            }
        };

        fetchBlogs();
    }, []);

    // Memoize the featured blogs for the carousel (e.g., top 5 latest blogs)
    const featuredBlogs = useMemo(() => {
        return blogs.slice(0, 5); // Take the first 5 blogs (which are the latest due to sorting)
    }, [blogs]);

    // Filter the *remaining* blogs for the BlogList, excluding those already in the carousel
    const filteredRemainingBlogs = useMemo(() => {
        const remaining = blogs.slice(5); // All blogs AFTER the featured ones
        const currentLang = i18n.language;

        if (!activeCategory || activeCategory === 'for-you') {
            return remaining;
        }

        const cat = activeCategory.toLowerCase();
        return remaining.filter((b) => {
            const title = b.title?.[currentLang] || b.title?.en || '';
            const content = b.content?.[currentLang] || b.content?.en || '';
            return (
                (b.tags && b.tags.some((tag) => tag.toLowerCase().includes(cat))) ||
                (title && title.toLowerCase().includes(cat)) ||
                (content && content.toLowerCase().includes(cat))
            );
        });
    }, [blogs, activeCategory, i18n.language]);

    if (loading) {
        // You can render a skeleton loader or a simple "Loading..." message here
        return <div className="text-center py-10 dark:text-gray-200">Loading blogs...</div>;
    }

    return (
        <div className="min-h-screen">
            {/* Render the Featured Blog Carousel at the very top */}
            {featuredBlogs.length > 0 && (
                <FeaturedBlogCarousel blogs={featuredBlogs} />
            )}

            {/* Main content area for the rest of the blogs */}
            <main className="container mx-auto px-4 py-8">
                {/* Potentially add a heading for the regular blog list */}
                {filteredRemainingBlogs.length > 0 && (
                    <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                        Latest Blogs
                    </h2>
                )}

                {/* Render the BlogList with the remaining, filtered blogs */}
                <BlogList blogs={filteredRemainingBlogs} />

                {filteredRemainingBlogs.length === 0 && featuredBlogs.length === 0 && (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">No blogs found.</p>
                )}
                {filteredRemainingBlogs.length === 0 && featuredBlogs.length > 0 && (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                        No more blogs matching this category.
                    </p>
                )}
            </main>
        </div>
    );
};

export default Home;