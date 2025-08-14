// client/src/pages/AdminBlogList.js
import React, { useEffect, useState, useRef } from 'react'; // Added useRef
import { useNavigate } from 'react-router-dom';
import AdminBlogTable from '../components/AdminBlogTable';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

const AdminBlogList = () => {
    const { t } = useTranslation();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const timerRef = useRef(null); // Ref to hold our debounce timer

    const fetchBlogs = async (query = '') => {
        setLoading(true);
        try {
            let res;
            if (query) {
                res = await api.get(`/api/admin/blogs/search?q=${query}`);
            } else {
                res = await api.get('/api/admin/blogs?limit=100');
            }

            setBlogs(res.data.blogs || []);
            setError('');
        } catch (err) {
            console.error('Error fetching blogs for admin dashboard:', err.response?.data || err.message);
            setError(t('Error loading blogs'));
        } finally {
            setLoading(false);
        }
    };

    // New useEffect to handle debouncing
    useEffect(() => {
        // Clear the previous timer to reset the debounce period
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // Set a new timer
        timerRef.current = setTimeout(() => {
            fetchBlogs(searchQuery);
        }, 500); // 500ms delay before fetching

        // Cleanup function: clears the timer when the component unmounts or dependencies change
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [searchQuery]); // The effect re-runs only when searchQuery changes

    // The rest of your component's logic is unchanged
    const handleEdit = (blog) => {
        navigate('/admin', { state: { blogToEdit: blog } });
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('admin_panel.confirm_delete'))) {
            try {
                await api.delete(`/api/admin/blogs/${id}`);
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
                <div className="flex justify-between items-center mb-6 flex-wrap">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 md:mb-0">
                        {t('Added Blogs List')}
                    </h1>
                </div>

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder={t('Search blogs...')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <AdminBlogTable blogs={blogs} onEdit={handleEdit} onDelete={handleDelete} />
                </div>
            </div>
        </div>
    );
};

export default AdminBlogList;