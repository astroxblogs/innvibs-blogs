import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import ReactQuill, { Quill } from 'react-quill'; // 1. Import Quill
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react'; // 2. Import the resize module

// 3. Register the resize module with Quill
Quill.register('modules/imageResize', ImageResize);

const categories = [
    'Technology', 'Fashion', 'Health & Wellness', 'Travel',
    'Food & Cooking', 'Sports', 'Business & Finance', 'Lifestyle'
];

const AdminBlogForm = ({ blog, onSave }) => {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const [content, setContent] = useState('');
    const quillRef = React.useRef(null); // Create a ref for the editor

    // 4. Custom image handler function
    const imageHandler = () => {
        const editor = quillRef.current.getEditor();
        const url = prompt('Enter the image URL'); // Show a popup to paste the URL
        if (url) {
            const range = editor.getSelection();
            editor.insertEmbed(range.index, 'image', url);
        }
    };

    // 5. Create the new, enhanced editor configuration using useMemo
    const modules = useMemo(() => ({
        // Configuration for the image resize module
        imageResize: {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize', 'Toolbar']
        },
        // Configuration for the toolbar
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                [{ 'font': [] }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'align': [] }], // Add alignment dropdown
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler, // Tell the image button to use our custom handler
            },
        },
    }), []);

    useEffect(() => {
        if (blog) {
            reset(blog);
            setContent(blog.content || '');
        } else {
            reset({ title: '', image: '', tags: '', category: categories[0] });
            setContent('');
        }
    }, [blog, reset]);

    const onSubmit = async (data) => {
        const tags = typeof data.tags === 'string' ? data.tags.split(',').map(tag => tag.trim()) : [];
        const payload = {
            title: data.title,
            image: data.image,
            content: content,
            tags,
            category: data.category
        };
        try {
            const res = blog
                ? await axios.put(`/api/blogs/${blog._id}`, payload)
                : await axios.post('/api/blogs', payload);
            onSave(res.data);
            reset();
            setContent('');
        } catch (error) {
            console.error('Error saving blog:', error);
            alert('Error saving blog: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mb-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow flex flex-col gap-4 max-w-4xl mx-auto"
        >
            <input
                className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full"
                placeholder="Title"
                {...register('title', { required: true })}
            />
            <input
                className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full"
                placeholder="Paste Main Cover Image URL"
                {...register('image')}
            />

            <div>
                <label className="block font-medium text-sm mb-1 text-gray-700 dark:text-gray-300">
                    Content
                </label>
                {/* 6. Update the ReactQuill component with the ref and new modules */}
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    className="bg-white"
                />
            </div>

            <input
                className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full mt-4"
                placeholder="Tags (comma separated)"
                {...register('tags')}
            />
            <select
                className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full"
                {...register('category', { required: true })}
            >
                {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
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