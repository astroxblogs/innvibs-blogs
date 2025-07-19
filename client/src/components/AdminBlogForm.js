import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor'; // 1. Import the Markdown editor

const categories = [
    'Technology',
    'Fashion',
    'Health & Wellness',
    'Travel',
    'Food & Cooking',
    'Sports',
    'Business & Finance',
    'Lifestyle'
];

const CLOUDINARY_UPLOAD_PRESET = 'Myblogs';
const CLOUDINARY_CLOUD_NAME = 'dsoeem7bp';

const AdminBlogForm = ({ blog, onSave }) => {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const [uploading, setUploading] = useState(false);
    const imageUrl = watch('image');
    // 2. State for the Markdown content instead of the old editor state
    const [markdown, setMarkdown] = useState('');

    useEffect(() => {
        if (blog) {
            // When editing, pre-fill the form and the markdown editor
            reset(blog);
            setMarkdown(blog.content || '');
        } else {
            // When creating, reset everything
            reset({ title: '', content: '', image: '', tags: '', category: categories[0] });
            setMarkdown('');
        }
    }, [blog, reset]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        setUploading(true);
        try {
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData
            );
            setValue('image', res.data.secure_url);
        } catch (err) {
            console.error('Image upload failed:', err);
            alert('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data) => {
        const tags = typeof data.tags === 'string'
            ? data.tags.split(',').map(tag => tag.trim())
            : [];

        // 3. The payload now sends the raw markdown content
        const payload = {
            title: data.title,
            image: data.image,
            content: markdown, // Use the markdown state here
            tags,
            category: data.category
        };

        try {
            // 4. The Axios interceptor handles authorization, so no headers are needed here
            const res = blog
                ? await axios.put(`/api/blogs/${blog._id}`, payload)
                : await axios.post('/api/blogs', payload);

            onSave(res.data);
            reset();
            setMarkdown(''); // Reset the markdown editor
        } catch (error) {
            console.error('Error saving blog:', error);
            alert('Error saving blog: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mb-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow flex flex-col gap-4 max-w-2xl mx-auto"
        >
            <input
                className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full"
                placeholder="Title"
                {...register('title', { required: true })}
            />

            <input
                className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full"
                placeholder="Paste image URL (optional)"
                {...register('image')}
            />

            <div>
                <label className="block font-medium text-sm mb-1 text-gray-700 dark:text-gray-300">
                    Or Upload Image
                </label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt="Uploaded preview"
                        className="mt-2 h-32 object-contain border rounded"
                    />
                )}
            </div>

            {/* 5. Replaced the old editor with the new MDEditor component */}
            <div data-color-mode="light">
                <label className="block font-medium text-sm mb-1 text-gray-700 dark:text-gray-300">
                    Content (Markdown)
                </label>
                <MDEditor
                    value={markdown}
                    onChange={setMarkdown}
                    height={400}
                    previewOptions={{
                        // This allows HTML tags within your markdown, which is useful
                        skipHtml: false
                    }}
                />
            </div>

            <input
                className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full"
                placeholder="Tags (comma separated)"
                {...register('tags')}
            />

            <select
                className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full"
                {...register('category', { required: true })}
            >
                {categories.map((category) => (
                    <option key={category} value={category}>
                        {category}
                    </option>
                ))}
            </select>

            <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold transition-colors w-full md:w-auto self-end"
                type="submit"
            >
                {blog ? 'Update' : 'Add'} Blog
            </button>
        </form>
    );
};

export default AdminBlogForm;
