 // client/src/pages/AdminBlogList.js
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminBlogTable from '../components/AdminBlogTable';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

const AdminBlogList = () => {
    const { t } = useTranslation();
    const [blogs, setBlogs] = useState([]);
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
    }, []);

    const handleEdit = (blog) => {
        // We will navigate to the AdminDashboard to edit a specific blog
        // using state to pass the blog object
        navigate('/dashboard', { state: { blogToEdit: blog } });
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('admin_panel.confirm_delete'))) {
            try {
                await api.delete(`/api/admin/blogs/${id}`); // <-- Changed API endpoint
                setBlogs(blogs.filter((b) => b._id !== id));
            } catch (err) {
                console.error('Error deleting blog:', err.response?.data || err.message);
                alert(`${t('admin_panel.delete_error_message')}: ${err.response?.data?.error || err.message}`);
            }
        }
    };

    if (loading) return <div className="text-center p-10 dark:text-gray-200">{t('loading blogs')}</div>;
    if (error) return <div className="text-center p-10 text-red-500">{t('error')}: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10">
            <div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        {t('Added Blogs List')}
                    </h1>
                </div>

                <div>
                    <AdminBlogTable blogs={blogs} onEdit={handleEdit} onDelete={handleDelete} />
                </div>
            </div>
        </div>
    );
};

export default AdminBlogList;