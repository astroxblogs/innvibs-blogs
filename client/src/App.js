import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// Component Imports (ensure all imports are grouped at the very top)
import Footer1 from './components/Footer1';
import TopNavigation from './components/TopNavigation';
import Home from './pages/Home';

// Lazy-loaded page components
const BlogDetailPage = React.lazy(() => import('./pages/BlogDetailPage'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const CategoryPage = React.lazy(() => import('./pages/CategoryPage'));

// --- GLOBAL AXIOS CONFIGURATION ---
// Use environment variable for the API base URL
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

// --- Axios Interceptors ---
// This interceptor will run before every API request is sent.
axios.interceptors.request.use(
    (config) => {
        // Check if the request URL is NOT Cloudinary's upload URL
        // This prevents sending Authorization header to Cloudinary's unsigned upload endpoint
        const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`;
        if (config.url && !config.url.startsWith(cloudinaryUploadUrl)) {
            // Get the token from local storage
            const adminToken = localStorage.getItem('adminToken');

            // If a token exists, add the 'Authorization: Bearer <token>' header
            if (adminToken) {
                config.headers['Authorization'] = `Bearer ${adminToken}`;
            }
        }
        // If it IS a Cloudinary upload URL, the Authorization header will NOT be added.

        return config; // Continue with the request
    },
    (error) => {
        // Handle any request errors
        return Promise.reject(error);
    }
);

// This interceptor handles what happens AFTER a response is received.
const AxiosInterceptorNavigate = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                // If the server responds with 401, the token is invalid/expired.
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin/login'); // Redirect to the login page
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

// Helper function to create URL-friendly slugs
const slugify = (text) => {
    return text.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
};

function App() {
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

    return (
        <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary transition-colors flex flex-col">
            <AxiosInterceptorNavigate />

            {!isAdminPath && (
                <TopNavigation
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                    setSearchQuery={setSearchQuery}
                />
            )}

            <main className="flex-1 overflow-y-auto">
                <Suspense fallback={<div className="text-center py-20 dark:text-gray-200">Loading page...</div>}>
                    <Routes>
                        <Route
                            path="/"
                            element={<Home activeCategory={activeCategory} searchQuery={searchQuery} />}
                        />
                        <Route path="/category/:categoryName" element={<CategoryPage />} />
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