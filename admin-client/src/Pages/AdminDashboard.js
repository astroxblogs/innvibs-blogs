import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminBlogForm from '../components/AdminBlogForm';
import AdminBlogList from './AdminBlogList';
import api, { setAccessToken } from '../services/api';
import { useTranslation } from 'react-i18next';
import CategoryManager from './CategoryManager'; // Ensure this is imported

const AdminDashboard = () => {
    const { t } = useTranslation();
    const [editingBlog, setEditingBlog] = useState(null);
    const [activeView, setActiveView] = useState('blogForm'); // 'blogForm', 'blogList', or 'categoryManager'
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.blogToEdit) {
            setEditingBlog(location.state.blogToEdit);
            setActiveView('blogForm'); // Switch to the blog form view
        }
    }, [location.state]);

    const handleSave = (savedBlog) => {
        setEditingBlog(null);
        setActiveView('blogList'); // Switch to the blog list view after saving
        alert('Blog saved successfully!');
    };

    const handleLogout = async () => {
        try {
            await api.post('/api/admin/logout');
            setAccessToken(null);
            console.log("Logged out successfully.");
            navigate('/');
        } catch (err) {
            console.error('Logout failed:', err);
            setAccessToken(null);
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10">
            <div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 md:mb-0">
                        {t('Admin Dashboard')}
                    </h1>
                    <div className="flex items-center gap-4 flex-wrap">
                        {/* Navigation Buttons for different views */}
                        <button
                            onClick={() => { setEditingBlog(null); setActiveView('blogForm'); }}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                            {t('Add New Blog')}
                        </button>
                        <button
                            onClick={() => setActiveView('blogList')}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                            {t('Added Blogs List')}
                        </button>
                        <button
                            onClick={() => setActiveView('categoryManager')}
                            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                            {t('Manage Categories')}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                            {t('Logout')}
                        </button>
                    </div>
                </div>

                {/* Conditional Rendering based on activeView */}
                {activeView === 'blogForm' && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 text-center">
                            {editingBlog ? `${t('Editing')}: ${editingBlog.title_en || editingBlog.title || ''}` : t('Add new blog post')}
                        </h2>
                        <AdminBlogForm
                            key={editingBlog ? editingBlog._id : 'new-blog'}
                            blog={editingBlog}
                            onSave={handleSave}
                        />
                        {editingBlog && (
                            <button onClick={() => setEditingBlog(null)} className="mt-4 text-sm text-blue-500 hover:underline">
                                {t('Cancel Edit & Add New Post')}
                            </button>
                        )}
                    </div>
                )}

                {activeView === 'blogList' && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 text-center">
                            {t('Added Blogs List')}
                        </h2>
                        <AdminBlogList
                            onEdit={(blog) => {
                                setEditingBlog(blog);
                                setActiveView('blogForm');
                            }}
                        />
                    </div>
                )}

                {activeView === 'categoryManager' && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 text-center">
                            {t('Category Manager')}
                        </h2>
                        <CategoryManager />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;