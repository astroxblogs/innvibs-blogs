import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BlogDetail from '../components/BlogDetail';
import axios from 'axios';

const BlogDetailPage = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        axios.get(`/api/blogs/${id}`).then((res) => setBlog(res.data));
    }, [id]);

    if (!blog) return <div>Loading...</div>;
    return <BlogDetail blog={blog} />;
};

export default BlogDetailPage; 