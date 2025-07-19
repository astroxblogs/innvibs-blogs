import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import TopNavigation from './components/TopNavigation';
import Home from './pages/Home';
import BlogDetailPage from './pages/BlogDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Footer1 from './components/Footer1';
import CategoryPage from './pages/CategoryPage';

// --- THIS COMPONENT WAS MISSING ---
// It needs to be defined before the main App component uses it.
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
// ------------------------------------

function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const isAdminPath = location.pathname.startsWith('/admin');

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSearchQuery('');
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
        <Routes>
          <Route
            path="/"
            element={<Home activeCategory={activeCategory} searchQuery={searchQuery} />}
          />

          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {!isAdminPath && <Footer1 />}
    </div>
  );
}

export default App;