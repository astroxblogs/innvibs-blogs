import React from 'react';
import { Link } from 'react-router-dom';
import { marked } from 'marked'; // 1. Import 'marked'
import LikeButton from './LikeButton.jsx';
import { MessageSquare } from 'lucide-react';

const BlogCard = ({ blog }) => {
    // 2. Update the excerpt function to handle Markdown
    const getPlainTextExcerpt = (markdownContent) => {
        if (!markdownContent) return '';

        // First, convert Markdown to an HTML string
        const html =markdownContent;

        // Then, use a temporary element to strip the HTML tags and get plain text
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        let text = tempDiv.textContent || tempDiv.innerText || '';
        text = text.replace(/\s\s+/g, ' ').trim();

        return text.slice(0, 150); // Return a snippet of the plain text
    };

    const excerpt = getPlainTextExcerpt(blog.content);

    return (
        <div className="flex flex-col md:flex-row items-stretch bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow mb-6 overflow-hidden w-full">
            <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                    <Link to={`/blog/${blog._id}`} className="block">
                        <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{blog.title}</h2>
                    </Link>
                    <div className="flex flex-wrap gap-2 mb-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{new Date(blog.date).toLocaleDateString()}</span>
                        {blog.tags && blog.tags.map((tag) => (
                            <span key={tag} className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">#{tag}</span>
                        ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {excerpt}
                        {excerpt.length >= 150 && (
                            <>
                                ...
                                <Link to={`/blog/${blog._id}`} className="text-blue-500 hover:underline font-semibold ml-1">
                                    Read More
                                </Link>
                            </>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400 text-sm mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <LikeButton blogId={blog._id} initialLikes={blog.likes} />
                    <Link to={`/blog/${blog._id}#comments`} className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <MessageSquare size={16} />
                        <span>{blog.commentCount || blog.comments?.length || 0}</span>
                    </Link>
                </div>
            </div>

            {blog.image && (
                <Link to={`/blog/${blog._id}`} className="w-full md:w-56 h-48 md:h-auto flex-shrink-0">
                    <img src={blog.image} alt={blog.title} className="object-cover w-full h-full transition-transform hover:scale-105" />
                </Link>
            )}
        </div>
    );
};

export default BlogCard;