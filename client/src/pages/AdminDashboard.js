import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminBlogForm from '../components/AdminBlogForm';
import AdminBlogTable from '../components/AdminBlogTable';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
    const { t } = useTranslation();
    const [blogs, setBlogs] = useState([]);
    const [editingBlog, setEditingBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                
                const res = await axios.get('/api/admin/verify-token');
                const isValid = res.data.isAdmin;
                if (!isValid) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin/login');
                    return;
                }
            } catch (err) {
                console.error('Token verification failed:', err.response?.data || err.message);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin/login');
                }
            }
        };

        const fetchBlogs = async () => {
            setLoading(true);
            try {
                 
                const res = await axios.get('/api/admin/blogs');  
                setBlogs(res.data);  
            } catch (err) {
                console.error('Error fetching blogs for admin dashboard:', err.response?.data || err.message);
                setError(t('general.error_loading_blogs'));
                if (err.response?.status === 401 || err.response?.status === 403) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin/login');
                }
            } finally {
                setLoading(false);
            }
        };

        // Run verification first, then fetch blogs
        verifyToken().then(() => {
            fetchBlogs();
        });
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
            await axios.delete(`/api/blogs/${id}`);
            setBlogs(blogs.filter((b) => b._id !== id));
        } catch (err) {
            console.error('Error deleting blog:', err.response?.data || err.message);
            alert(t('admin_panel.delete_error_message') + (err.response?.data?.error || err.message));
        }
    };

    const handleAddNew = () => {
        setEditingBlog(null);
    };

    if (loading) return <div className="text-center p-10 dark:text-gray-200">{t('admin_panel.loading_dashboard')}</div>;
    if (error) return <div className="text-center p-10 text-red-500">{t('general.error')}: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10">
            <div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-900 dark:text-white">
                    {t('admin_panel.dashboard')}
                </h1>

                <div className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 text-center">
                        {editingBlog
                            ? `${t('admin_panel.editing')}: ${editingBlog.title_en || editingBlog.title || ''}`
                            : t('admin_panel.add_new_blog_post')
                        }
                    </h2>

                    <AdminBlogForm
                        key={editingBlog ? editingBlog._id : 'new-blog'}
                        blog={editingBlog}
                        onSave={handleSave}
                    />

                    {editingBlog && (
                        <button onClick={handleAddNew} className="mt-4 text-sm text-blue-500 hover:underline">
                            {t('admin_panel.cancel_edit_add_new_post')}
                        </button>
                    )}
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                        {t('admin_panel.manage_existing_blogs')}
                    </h2>
                    <AdminBlogTable blogs={blogs} onEdit={handleEdit} onDelete={handleDelete} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;