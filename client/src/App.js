import React, { useState, useEffect, Suspense, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useTranslation } from 'react-i18next'; // Corrected import

// Component Imports
import Footer1 from './components/Footer1';
import TopNavigation from './components/TopNavigation';
import Home from './pages/Home';
import ScrollToTop from './components/ScrollToTop';

// Dynamically imported components for the public-facing blog
const BlogDetailPage = React.lazy(() => import('./pages/BlogDetailPage'));
const CategoryPage = React.lazy(() => import('./pages/CategoryPage'));
const TagPage = React.lazy(() => import('./pages/TagPage'));

// Set a default base URL for Axios
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

axios.interceptors.request.use(
    (config) => {
        const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`;
        if (config.url && !config.url.startsWith(cloudinaryUploadUrl)) {
            // No changes here
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const slugify = (text) => {
    return text.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
};

 
const AdminRedirectComponent = () => {
    const navigate = useNavigate();
    const hasRedirected = useRef(false);

    useEffect(() => {
        // This check ensures the code inside runs only once.
        if (!hasRedirected.current) {
            // Use the environment variable directly.
            const adminUrl = process.env.REACT_APP_ADMIN_URL;

            if (adminUrl) {
                window.open(adminUrl, '_blank', 'noopener,noreferrer');
                hasRedirected.current = true;
            } else {
                console.error("Admin URL not found in environment variables.");
            }

            // Redirect the current tab back to the homepage
            navigate('/');
        }
    }, [navigate]);

    return (
        <div >  </div>
    );
};
// -----------------------------------------------------

function App() {
    const { t } = useTranslation();
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setSearchQuery('');
        if (category === 'all') {
            navigate('/');
        } else {
            const categorySlug = slugify(category);
            navigate(`/category/${categorySlug}`);
        }
    };

    const handleLogoClick = () => {
        setActiveCategory('all');
        setSearchQuery('');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary transition-colors flex flex-col">
            <ScrollToTop />
            <TopNavigation
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
                setSearchQuery={setSearchQuery}
                onLogoClick={handleLogoClick}
            />
            <main className="flex-1 overflow-y-auto">
                <Suspense fallback={<div className="text-center py-20 dark:text-gray-200">{t('general.loading_page')}</div>}>
                    <Routes>
                        <Route path="/" element={<Home activeCategory={activeCategory} searchQuery={searchQuery} />} />
                        <Route path="/category/:categoryName" element={<CategoryPage />} />
                        <Route path="/tag/:tagName" element={<TagPage />} />
                        <Route path="/blog/:id" element={<BlogDetailPage />} />

                        {/* This is the final, working redirect route */}
                        <Route path="/admin" element={<AdminRedirectComponent />} />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </main>
            <Footer1 />
        </div>
    );
}

export default App;