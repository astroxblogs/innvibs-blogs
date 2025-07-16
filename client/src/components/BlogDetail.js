import React from 'react';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';

const BlogDetail = ({ blog }) => (
    <article className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow p-0 md:p-8 mt-8">
        <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover rounded-t-lg md:rounded-lg mb-6" />
        <h1 className="text-4xl font-extrabold mb-2 text-gray-900 dark:text-white leading-tight">{blog.title}</h1>
        <div className="flex flex-wrap gap-3 items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
            <span>{new Date(blog.date).toLocaleDateString()}</span>
            {blog.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">#{tag}</span>
            ))}
            <span className="flex items-center gap-1"><span className="material-icons text-base">thumb_up</span> {blog.likes || 0}</span>
            <span className="flex items-center gap-1"><span className="material-icons text-base">comment</span> {blog.comments?.length || 0}</span>
        </div>
        {/*
            THE CHANGE IS HERE:
            Use dangerouslySetInnerHTML to render the HTML content.
            The __html property is where you pass your raw HTML string.
        */}
        <div
            className="prose prose-lg dark:prose-invert max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        <div className="mb-8">
            <LikeButton blogId={blog._id} initialLikes={blog.likes} />
        </div>
        <CommentSection blogId={blog._id} initialComments={blog.comments} />
    </article>
);

export default BlogDetail;