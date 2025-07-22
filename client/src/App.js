import React, { useState, useEffect, Suspense } from 'react'; // <-- Import Suspense
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Footer1 from './components/Footer1';

import TopNavigation from './components/TopNavigation';
import Home from './pages/Home'; // Home page is often loaded eagerly for best initial experience

// Use React.lazy for code splitting these pages
const BlogDetailPage = React.lazy(() => import('./pages/BlogDetailPage'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const CategoryPage = React.lazy(() => import('./pages/CategoryPage'));
// If you had a NotFound page component:
// const NotFound = React.lazy(() => import('./pages/NotFound'));

// --- THIS IS THE MISSING CODE BLOCK ---
// This interceptor will run before every API request is sent.
axios.interceptors.request.use(
    (config) => {
        // Get the token from local storage
        const adminToken = localStorage.getItem('adminToken');

        // If a token exists, add the 'Authorization: Bearer <token>' header
        if (adminToken) {
            config.headers['Authorization'] = `Bearer ${adminToken}`;
        }

        return config; // Continue with the request
    },
    (error) => {
        // Handle any request errors
        return Promise.reject(error);
    }
);
// --- END OF FIX ---


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
                {/* Wrap your Routes with Suspense to show a fallback while lazy components load */}
                <Suspense fallback={<div className="text-center py-20 dark:text-gray-200">Loading page...</div>}>
                    <Routes>
                        {/* Home page is typically loaded eagerly for immediate content */}
                        <Route
                            path="/"
                            element={<Home activeCategory={activeCategory} searchQuery={searchQuery} />}
                        />
                        {/* Lazy-loaded routes */}
                        <Route path="/category/:categoryName" element={<CategoryPage />} />
                        <Route path="/blog/:id" element={<BlogDetailPage />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/login" element={<AdminLogin />} />
                        {/* If you had a NotFound component: <Route path="*" element={<NotFound />} /> */}
                        {/* Added 'replace' to Navigate for cleaner history with lazy loading */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </main>

            {!isAdminPath && <Footer1 />}
        </div>
    );
}

export default App; 