// client/src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminBlogForm from '../components/AdminBlogForm';
import AdminBlogTable from '../components/AdminBlogTable';
import axios from 'axios';

const AdminDashboard = () => {
    const [blogs, setBlogs] = useState([]);
    const [editingBlog, setEditingBlog] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        const fetchBlogs = async () => {
            try {
                const res = await axios.get('/api/blogs', { headers: { Authorization: token } });
                setBlogs(res.data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin/login');
                }
            }
        };

        fetchBlogs();
    }, [navigate]);

    const handleEdit = (blog) => setEditingBlog(blog);

    const handleDelete = async (id) => {
        const token = localStorage.getItem('adminToken');
        try {
            await axios.delete(`/api/blogs/${id}`, { headers: { Authorization: token } });
            setBlogs(blogs.filter((b) => b._id !== id));
        } catch (error) {
            console.error('Error deleting blog:', error);
            // Use a custom message box instead of alert()
            // For example, you could have a state variable for a message,
            // and a simple modal component that displays it.
            // For this example, I'll just log to console as per instruction.
            console.log('Error deleting blog: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleSave = (blog) => {
        if (editingBlog) {
            setBlogs(blogs.map((b) => (b._id === blog._id ? blog : b)));
            setEditingBlog(null); // Clear editing state after save
        } else {
            setBlogs([...blogs, blog]);
        }
    };

    return (
        // Outer div to take full height and center content using flexbox
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-10">
            {/* Inner container for the dashboard content, with max-width and padding */}
            <div className="w-full max-w-4xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-900 dark:text-white">
                    Admin Dashboard
                </h1>
                <AdminBlogForm blog={editingBlog} onSave={handleSave} />
                <AdminBlogTable blogs={blogs} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
        </div>
    );
};

export default AdminDashboard;