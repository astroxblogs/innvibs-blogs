import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'fr', label: 'French' },
    { value: 'es', label: 'Spanish' }
];

// Replace with your actual Cloudinary config
const CLOUDINARY_UPLOAD_PRESET = 'Myblogs';
const CLOUDINARY_CLOUD_NAME = 'dsoeem7bp';

const AdminBlogForm = ({ blog, onSave }) => {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const [uploading, setUploading] = useState(false);
    const imageUrl = watch('image');

    useEffect(() => {
        if (blog) reset(blog);
        else reset({ title: '', content: '', image: '', tags: '', language: 'en' });
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

        const token = localStorage.getItem('adminToken');

        const payload = {
            title: data.title,
            image: data.image, // Stored, not shown
            content: data.content.trim(), // Pure text content
            tags,
            language: data.language
        };

        try {
            const res = blog
                ? await axios.put(`/api/blogs/${blog._id}`, payload, { headers: { Authorization: token } })
                : await axios.post('/api/blogs', payload, { headers: { Authorization: token } });

            onSave(res.data);
            reset();

        } catch (error) {
            console.error('Error saving blog:', error);
            alert('Error saving blog: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow flex flex-col gap-4 max-w-2xl mx-auto">
            <input
                className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full"
                placeholder="Title"
                {...register('title', { required: true })}
            />

            {/* Manual Image URL Input */}
            <input
                className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full"
                placeholder="Paste image URL (optional)"
                {...register('image')}
            />

            {/* Upload Image */}
            <div>
                <label className="block font-medium text-sm mb-1 text-gray-700 dark:text-gray-300">Or Upload Image</label>
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

            <textarea
                className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full min-h-[100px]"
                placeholder="Content"
                {...register('content', { required: true })}
            />

            <input
                className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full"
                placeholder="Tags (comma separated)"
                {...register('tags')}
            />

            <select
                className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full"
                {...register('language', { required: true })}
            >
                {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
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
