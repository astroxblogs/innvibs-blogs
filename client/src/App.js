import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'; // <-- ADD THIS IMPORT

// Import your components and pages
import TopNavigation from './components/TopNavigation';
import Home from './pages/Home';
import BlogDetailPage from './pages/BlogDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Footer1 from './components/Footer1';

// --- Interceptor Setup ---
// This component will handle the redirection logic for expired tokens.
const AxiosInterceptorNavigate = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Create an interceptor to handle API responses
    const interceptor = axios.interceptors.response.use(
      response => response, // Simply return successful responses
      error => {
        // Check if the error is a 401 Unauthorized (which our backend sends for expired JWTs)
        if (error.response && error.response.status === 401) {
          console.log('Session expired or invalid. Logging out.');
          // Remove the invalid token from storage
          localStorage.removeItem('adminToken');
          // Redirect to the admin login page
          navigate('/admin/login');
        }
        // Important: return the error so that individual component's .catch() blocks can still handle other errors
        return Promise.reject(error);
      }
    );

    // Cleanup function to remove the interceptor when the component unmounts
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  return null; // This component does not render any UI
};


function App() {
  const [activeCategory, setActiveCategory] = useState('for-you');
  const location = useLocation();

  // Determine if the current path is an admin path
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary transition-colors flex flex-col">
      {/* Add the interceptor component here. It's invisible and handles auth globally. */}
      <AxiosInterceptorNavigate />

      {!isAdminPath && (
        <TopNavigation activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      )}

      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home activeCategory={activeCategory} />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          {/* NOTE: You might want a protected route component for the dashboard later,
              but for now, the interceptor will handle expired sessions. */}
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
