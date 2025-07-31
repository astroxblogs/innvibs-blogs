import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BlogDetail from '../components/BlogDetail';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const BlogDetailPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log(`DEBUG (BlogDetailPage): Attempting to fetch blog with ID: /api/blogs/${id}`);
                const res = await axios.get(`/api/blogs/${id}`);
                console.log('DEBUG (BlogDetailPage): API Response received:', res.data); // Log the full response

                if (res.data) {
                    setBlog(res.data);
                    console.log('DEBUG (BlogDetailPage): Blog state updated to:', res.data);
                } else {
                    console.warn('DEBUG (BlogDetailPage): API response data is empty or null for ID:', id);
                    setError(t('Blog post not found'));
                    setBlog(null);
                }

            } catch (err) {
                console.error("DEBUG (BlogDetailPage): Error fetching blog post:", err.response?.data || err.message, err); // Log full error object
                setError(t('Error loading blogs detail', { error: err.response?.data?.error || err.message }));
                setBlog(null);
            } finally {
                setLoading(false);
                console.log('DEBUG (BlogDetailPage): Loading state set to false.');
            }
        };

        if (id) {
            fetchBlog();
        } else {
            setLoading(false);
            setError(t('blog id missing'));
            setBlog(null);
            console.log('DEBUG (BlogDetailPage): Blog ID is missing from URL.');
        }
    }, [id, t]);

     
    useEffect(() => {
        console.log('DEBUG (BlogDetailPage): Current blog state after render cycle:', blog);
    }, [blog]);


    if (loading) return <div className="text-center mt-20 p-4 dark:text-gray-300">{t('loading post...')}</div>;
    if (error) return <div className="text-center mt-20 p-4 text-red-500">{error}</div>;

   
    if (!blog) return <div className="text-center mt-20 p-4 dark:text-gray-300">{t('Blog post not found')}</div>;

    console.log('DEBUG (BlogDetailPage): Rendering BlogDetail component with blog data:', blog); // NEW LOG
    return <BlogDetail blog={blog} />;
};

export default BlogDetailPage;