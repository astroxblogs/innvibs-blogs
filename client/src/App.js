import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useTranslation } from 'react-i18next'; // ADDED: Import useTranslation

// Component Imports
import Footer1 from './components/Footer1';
import TopNavigation from './components/TopNavigation';
import Home from './pages/Home';
import ScrollToTop from './components/ScrollToTop';

 
const BlogDetailPage = React.lazy(() => import('./pages/BlogDetailPage'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const CategoryPage = React.lazy(() => import('./pages/CategoryPage'));
const TagPage = React.lazy(() => import('./pages/TagPage'));

 
console.log('REACT_APP_API_BASE_URL from process.env:', process.env.REACT_APP_API_BASE_URL);
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

 
axios.interceptors.request.use(
    (config) => {
        const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`;
        if (config.url && !config.url.startsWith(cloudinaryUploadUrl)) {
            const adminToken = localStorage.getItem('adminToken');
            if (adminToken) {
                config.headers['Authorization'] = `Bearer ${adminToken}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Axios Interceptor for Navigation (placed outside App to use useNavigate)
const AxiosInterceptorNavigate = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin/login');
                }
                return Promise.reject(error);
            }
        );
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [navigate]);
    return null;
};

const slugify = (text) => {
    return text.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
};

function App() {
    const { t } = useTranslation(); // ADDED: Initialize t function
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const isAdminPath = location.pathname.startsWith('/admin');

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
            <AxiosInterceptorNavigate />

            {!isAdminPath && (
                <>
                    <TopNavigation
                        activeCategory={activeCategory}
                        onCategoryChange={handleCategoryChange}
                        setSearchQuery={setSearchQuery}
                        onLogoClick={handleLogoClick}
                    />
                    {/* REMOVED: EmailSubscriptionPopup rendering (as per your comment) */}
                    {/* <EmailSubscriptionPopup /> */}
                </>
            )}

            <main className="flex-1 overflow-y-auto">
                <Suspense fallback={<div className="text-center py-20 dark:text-gray-200">{t('general.loading_page')}</div>}> {/* UPDATED: Translated loading message */}
                    <Routes>
                        <Route
                            path="/"
                            element={<Home activeCategory={activeCategory} searchQuery={searchQuery} />}
                        />
                        <Route path="/category/:categoryName" element={<CategoryPage />} />
                        <Route path="/tag/:tagName" element={<TagPage />} />
                        <Route path="/blog/:id" element={<BlogDetailPage />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </main>

            {!isAdminPath && <Footer1 />}
        </div>
    );
}

export default App;