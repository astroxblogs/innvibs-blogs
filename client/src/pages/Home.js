import React, { useEffect, useState, useMemo } from 'react';
import BlogList from '../components/BlogList';
import axios from 'axios';

const Home = ({ activeCategory }) => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        axios
            .get(`/api/blogs`)
            .then((res) => setBlogs(res.data))
            .catch(() => setBlogs([]));
    }, []);

    const filteredBlogs = useMemo(() => {
        if (!activeCategory || activeCategory === 'for-you') return blogs;
        const cat = activeCategory.toLowerCase();
        return blogs.filter(
            (b) =>
                (b.tags && b.tags.some((tag) => tag.toLowerCase().includes(cat))) ||
                (b.title && b.title.toLowerCase().includes(cat)) ||
                (b.content && b.content.toLowerCase().includes(cat))
        );
    }, [blogs, activeCategory]);

    return <BlogList blogs={filteredBlogs} />;
};

export default Home;