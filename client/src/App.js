// client/src/App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Import the new TopNavigation component
import TopNavigation from './components/TopNavigation'; // <-- NEW IMPORT
// Remove direct imports for NavBar and ThemeToggle if they are only used inside TopNavigation now
// import NavBar from './components/NavBar'; // <-- REMOVE THIS LINE
// import ThemeToggle from './components/ThemeToggle'; // <-- REMOVE THIS LINE

import Home from './pages/Home';
import BlogDetailPage from './pages/BlogDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Footer from './components/Footer';

function App() {
  const [activeCategory, setActiveCategory] = useState('for-you');
  const location = useLocation();

  // Determine if the current path is an admin path
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary transition-colors flex flex-col">
      {/* Render the new TopNavigation component */}
      {/* Pass activeCategory and setActiveCategory down to it */}
      {!isAdminPath && (
        <TopNavigation activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      )}

      {/* REMOVE this div as ThemeToggle is now inside TopNavigation */}
      {/* <div className="flex justify-end items-center p-4 w-full">
                <ThemeToggle />
            </div> */}

      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home activeCategory={activeCategory} />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {!isAdminPath && <Footer />}
    </div>
  );
}

export default App;