import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import BlogDetailPage from './pages/BlogDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
// import LanguageToggle from './components/LanguageToggle';
import ThemeToggle from './components/ThemeToggle';
import NavBar from './components/NavBar';

function App() {
  const [activeCategory, setActiveCategory] = useState('for-you');

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors flex">
      <Router>
        <NavBar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        <div className="flex-1 ml-0 md:ml-64">
          <div className="flex justify-between items-center p-4">
            {/* <LanguageToggle /> */}
            <ThemeToggle />
          </div>
          <Routes>
            <Route path="/" element={<Home activeCategory={activeCategory} />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
