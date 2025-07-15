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
        axios
            .get('/api/blogs', { headers: { Authorization: token } })
            .then((res) => setBlogs(res.data))
            .catch((error) => {
                console.error('Error fetching blogs:', error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin/login');
                }
            });
    }, [navigate]);

    const handleEdit = (blog) => setEditingBlog(blog);
    const handleDelete = async (id) => {
        const token = localStorage.getItem('adminToken');
        try {
            await axios.delete(`/api/blogs/${id}`, { headers: { Authorization: token } });
            setBlogs(blogs.filter((b) => b._id !== id));
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Error deleting blog: ' + (error.response?.data?.error || error.message));
        }
    };
    const handleSave = (blog) => {
        if (editingBlog) {
            setBlogs(blogs.map((b) => (b._id === blog._id ? blog : b)));
            setEditingBlog(null);
        } else {
            setBlogs([...blogs, blog]);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <AdminBlogForm blog={editingBlog} onSave={handleSave} />
            <AdminBlogTable blogs={blogs} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
    );
};

export default AdminDashboard; 