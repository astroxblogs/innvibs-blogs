import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import BlogList from '../components/BlogList';
import FeaturedBlogCarousel from '../components/FeaturedBlogCarousel';

const Home = ({ activeCategory }) => {
    const { i18n } = useTranslation();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // This effect now re-fetches data when the language or category changes.
    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                // Determine the correct API endpoint based on the active category.
                const lang = i18n.language || 'en';
                const isCategoryView = activeCategory && activeCategory !== 'for-you';

                const url = isCategoryView
                    ? `/api/blogs/category/${activeCategory}?lang=${lang}`
                    : `/api/blogs?lang=${lang}`;

                const res = await axios.get(url);
                setBlogs(res.data);
            } catch (err) {
                console.error("Error fetching blogs:", err);
                setBlogs([]); // Set to empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [activeCategory, i18n.language]);

    // The featured carousel should only show on the main "For You" page.
    const featuredBlogs = useMemo(() => {
        const isForYouPage = !activeCategory || activeCategory === 'for-you';
        return isForYouPage ? blogs.slice(0, 5) : [];
    }, [blogs, activeCategory]);

    // The main list contains the rest of the blogs on the main page,
    // or ALL blogs when viewing a specific category.
    const listBlogs = useMemo(() => {
        const isForYouPage = !activeCategory || activeCategory === 'for-you';
        return isForYouPage ? blogs.slice(5) : blogs;
    }, [blogs, activeCategory]);

    if (loading) {
        return <div className="text-center py-10 dark:text-gray-200">Loading blogs...</div>;
    }

    // Dynamic heading that changes based on the view
    const pageTitle = activeCategory && activeCategory !== 'for-you'
        ? `Blogs in #${activeCategory}`
        : 'Latest Blogs';

    return (
        <div className="min-h-screen">
            {/* Carousel only renders if there are featured blogs */}
            {featuredBlogs.length > 0 && (
                <FeaturedBlogCarousel blogs={featuredBlogs} />
            )}

            <main className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white capitalize">
                    {pageTitle}
                </h2>

                <BlogList blogs={listBlogs} />

                {listBlogs.length === 0 && (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                        No blogs found in this category.
                    </p>
                )}
            </main>
        </div>
    );
};

export default Home;