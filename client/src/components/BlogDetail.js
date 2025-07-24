import React, { useState, useEffect, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom'; // <-- IMPORT Link
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

import LikeButton from '../components/LikeButton.jsx';
const CommentSection = React.lazy(() => import('../components/CommentSection'));

const createSafeAltText = (text) => {
    if (!text) return '';
    return text.replace(/\b(image|photo|picture)\b/gi, '').replace(/\s\s+/g, ' ').trim();
};

const BlogDetail = () => {
    const { id } = useParams();
    const { i18n } = useTranslation();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getLocalizedContent = (field, blogData, currentLang) => {
        const localizedField = blogData[`${field}_${currentLang}`];
        if (localizedField) {
            return localizedField;
        }
        if (blogData[`${field}_en`]) {
            return blogData[`${field}_en`];
        }
        return blogData[field] || '';
    };

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/blogs/${id}`);
                setBlog(res.data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch blog post:", err);
                setError('Failed to load the blog post. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchBlog();
        }
    }, [id]);

    const currentLang = i18n.language;
    const displayTitle = blog ? getLocalizedContent('title', blog, currentLang) : '';
    const displayContent = blog ? getLocalizedContent('content', blog, currentLang) : '';

    if (loading) return <div className="text-center mt-20 p-4 dark:text-gray-300">Loading post...</div>;
    if (error) return <div className="text-center mt-20 p-4 text-red-500">{error}</div>;
    if (!blog) return <div className="text-center mt-20 p-4 dark:text-gray-300">Blog post not found.</div>;

    const rawContentHtml = marked.parse(displayContent);
    const cleanContentHtml = DOMPurify.sanitize(rawContentHtml);

    const coverImage = blog.image ? blog.image : 'https://placehold.co/800x400/666/fff?text=No+Image';
    const cleanAltTitle = createSafeAltText(displayTitle);

    return (
        <article className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-xl p-4 sm:p-6 md:p-8 mt-4 md:mt-8 mb-8">
            <img
                src={coverImage}
                alt={cleanAltTitle}
                className="w-full h-auto max-h-[300px] sm:max-h-[400px] object-cover rounded-lg mb-4 md:mb-6 bg-gray-200"
                loading="lazy"
            />

            <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold mb-2 md:mb-3 text-gray-900 dark:text-white leading-tight" style={{ fontFamily: 'Arial, sans-serif' }}>{displayTitle}</h1>
            <div className="flex flex-wrap gap-x-3 gap-y-1 items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 md:mb-8">
                <span>Published on: {new Date(blog.date).toLocaleDateString()}</span>
                <span className="flex items-center gap-1">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.562 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.865.802V10.333z"></path></svg>
                    {blog.likes || 0}
                </span>
                <span className="flex items-center gap-1">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.08-3.242A8.877 8.877 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.72 14.48A6.879 6.879 0 008 15c3.314 0 6-2.686 6-6s-2.686-6-6-6a6.879 6.879 0 00-3.28.52l.995 2.985A.5.5 0 016 7h.5a.5.5 0 01.5.5v.5a.5.5 0 01-.5.5h-.5a.5.5 0 01-.5-.5v-.5a.5.5 0 01.3-.464L4.72 14.48z" clipRule="evenodd"></path></svg>
                    {blog.comments?.length || 0}
                </span>
            </div>

            <div
                className="prose prose-base sm:prose-lg lg:prose-xl dark:prose-invert max-w-none mb-6 md:mb-8
                           prose-img:rounded-xl prose-img:max-h-[400px] prose-img:mx-auto"
                dangerouslySetInnerHTML={{ __html: cleanContentHtml }}
            />

            {/* Make tags clickable */}
            <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
                {blog.tags?.map((tag) => (
                    <Link // <-- CHANGED from span to Link
                        key={tag}
                        to={`/tag/${encodeURIComponent(tag.toLowerCase())}`} // Link to the tag page
                        className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 text-sm font-medium rounded-full
                                   hover:bg-blue-200 dark:hover:bg-blue-600 hover:text-blue-700 dark:hover:text-blue-100
                                   transition-colors cursor-pointer" // Added hover effects and cursor
                    >
                        #{tag}
                    </Link> // <-- Close Link tag
                ))}
            </div>

            <div className="border-t dark:border-gray-700 pt-6">
                <div className="mb-8">
                    <LikeButton blogId={blog._id} initialLikes={blog.likes} />
                </div>
                <Suspense fallback={<div className="text-center py-10 dark:text-gray-400">Loading comments...</div>}>
                    <CommentSection blogId={blog._id} initialComments={blog.comments} />
                </Suspense>
            </div>
        </article>
    );
};

export default BlogDetail;