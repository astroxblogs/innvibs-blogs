import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminBlogForm from '../components/AdminBlogForm';
import AdminBlogTable from '../components/AdminBlogTable';
import api, { setAccessToken } from '../services/api'; // <-- CORRECTED: Import `setAccessToken` as a named export
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
    const { t } = useTranslation();
    const [blogs, setBlogs] = useState([]);
    const [editingBlog, setEditingBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/admin/blogs');
            setBlogs(res.data);
            setError('');
        } catch (err) {
            console.error('Error fetching blogs for admin dashboard:', err.response?.data || err.message);
            setError(t('Error loading blogs'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [navigate, t]);

    const handleSave = (savedBlog) => {
        const exists = blogs.some((b) => b._id === savedBlog._id);

        if (exists) {
            setBlogs(blogs.map((b) => (b._id === savedBlog._id ? savedBlog : b)));
        } else {
            setBlogs([savedBlog, ...blogs]);
        }
        setEditingBlog(null);
    };

    const handleEdit = (blog) => {
        setEditingBlog(blog);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/blogs/${id}`);
            setBlogs(blogs.filter((b) => b._id !== id));
        } catch (err) {
            console.error('Error deleting blog:', err.response?.data || err.message);
            alert(`${t('admin_panel.delete_error_message')}: ${err.response?.data?.error || err.message}`);
        }
    };

    const handleAddNew = () => {
        setEditingBlog(null);
    };

    const handleLogout = async () => {
        try {
            // Call the new logout endpoint to clear the HTTP-only cookie on the server
            await api.post('/api/admin/logout');
            // Clear the access token from memory using the named import
            setAccessToken(null); // <-- CORRECTED: Use the named import
            console.log("Logged out successfully.");
            navigate('/admin/login');
        } catch (err) {
            console.error('Logout failed:', err);
            // Even if the logout API call fails, we should still clear the token and redirect.
            setAccessToken(null); // <-- CORRECTED: Use the named import
            navigate('/admin/login');
        }
    };

    if (loading) return <div className="text-center p-10 dark:text-gray-200">{t('loading dashboard')}</div>;
    if (error) return <div className="text-center p-10 text-red-500">{t('error')}: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10">
            <div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        {t('Dashboard')}
                    </h1>
                    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                        {t('Logout')}
                    </button>
                </div>

                <div className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 text-center">
                        {editingBlog
                            ? `${t('Editing')}: ${editingBlog.title_en || editingBlog.title || ''}`
                            : t('Add new blog post')
                        }
                    </h2>

                    <AdminBlogForm
                        key={editingBlog ? editingBlog._id : 'new-blog'}
                        blog={editingBlog}
                        onSave={handleSave}
                    />

                    {editingBlog && (
                        <button onClick={handleAddNew} className="mt-4 text-sm text-blue-500 hover:underline">
                            {t('cancel edit add new post')}
                        </button>
                    )}
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                        {t('Existing blogs')}
                    </h2>
                    <AdminBlogTable blogs={blogs} onEdit={handleEdit} onDelete={handleDelete} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
