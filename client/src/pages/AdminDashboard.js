import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminBlogForm from '../components/AdminBlogForm';
import AdminBlogTable from '../components/AdminBlogTable';
import axios from 'axios';

const AdminDashboard = () => {
    const [blogs, setBlogs] = useState([]);
    const [editingBlog, setEditingBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const res = await axios.get('/api/blogs?limit=9999');
                setBlogs(res.data.blogs);
            } catch (err) {
                console.error('Error fetching blogs:', err);
                setError('Failed to load blog posts.');
                if (err.response?.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [navigate]);

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
        if (window.confirm('Are you sure you want to delete this blog?')) {
            const token = localStorage.getItem('adminToken');
            try {
                await axios.delete(`/api/blogs/${id}`, { headers: { Authorization: token } });
                setBlogs(blogs.filter((b) => b._id !== id));
            } catch (err) {
                console.error('Error deleting blog:', err);
                alert('Error deleting blog: ' + (err.response?.data?.error || err.message));
            }
        }
    };

    const handleAddNew = () => {
        setEditingBlog(null);
    };

    if (loading) return <div className="text-center p-10">Loading Dashboard...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10">
            <div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-900 dark:text-white">
                    Admin Dashboard
                </h1>

                {/* Blog Form Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 text-center"> {/* ADDED text-center and changed mb-4 to mb-6 */}
                        {editingBlog ? `Editing: ${editingBlog.title || ''}` : 'Add New Blog Post'}
                    </h2>

                    <AdminBlogForm
                        key={editingBlog ? editingBlog._id : 'new-blog'}
                        blog={editingBlog}
                        onSave={handleSave}
                    />

                    {editingBlog && (
                        <button onClick={handleAddNew} className="mt-4 text-sm text-blue-500 hover:underline">
                            + Cancel Edit & Add New Post
                        </button>
                    )}
                </div>

                {/* Blog Table Section */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                        Manage Existing Blogs
                    </h2>
                    <AdminBlogTable blogs={blogs} onEdit={handleEdit} onDelete={handleDelete} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;