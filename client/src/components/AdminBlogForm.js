import React, { useState, useEffect } from 'react'; // 'useCallback' removed
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

// Language configuration for the tabs
const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'fr', label: 'French' },
    { value: 'es', 'label': 'Spanish' }
];

// Define the initial state structure for a new blog post
const initialBlogState = {
    title: { en: '', es: '', fr: '', hi: '' },
    content: { en: '', es: '', fr: '', hi: '' },
    images: [], // To hold URLs of uploaded images
    tags: ''
};

const AdminBlogForm = ({ blog, onSave }) => {
    // State for the form data, following our new multilingual schema
    const [formData, setFormData] = useState(initialBlogState);
    // State to manage the currently selected language tab
    const [activeLang, setActiveLang] = useState('en');
    // State for image upload progress
    const [uploading, setUploading] = useState(false);

    // useEffect to populate the form when editing an existing blog
    useEffect(() => {
        if (blog) {
            // Ensure all language fields are present, falling back to empty strings
            const titles = { ...initialBlogState.title, ...blog.title };
            const contents = { ...initialBlogState.content, ...blog.content };

            setFormData({
                title: titles,
                content: contents,
                images: blog.images || [],
                tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : ''
            });
        } else {
            // If creating a new blog, reset to the initial state
            setFormData(initialBlogState);
        }
    }, [blog]);

    // Handler for text input changes (e.g., title, tags)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'title') {
            setFormData(prev => ({
                ...prev,
                title: { ...prev.title, [activeLang]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handler for the rich text editor changes
    const handleContentChange = (value) => {
        setFormData(prev => ({
            ...prev,
            content: { ...prev.content, [activeLang]: value }
        }));
    };

    // New handler for uploading multiple images to our own backend
    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const uploadFormData = new FormData();
        for (let i = 0; i < files.length; i++) {
            uploadFormData.append('images', files[i]);
        }

        setUploading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.post('/api/blogs/upload-images', uploadFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: token
                }
            });
            // Add new image URLs to the existing ones
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...res.data.urls]
            }));
        } catch (err) {
            console.error('Image upload failed:', err);
            // Use a more user-friendly error display than alert
        } finally {
            setUploading(false);
        }
    };

    // Handler to remove an image
    const handleRemoveImage = (urlToRemove) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter(url => url !== urlToRemove)
        }));
    };

    // Form submission handler
    const onSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Prepare the payload according to the new schema
        const payload = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        };

        // Basic validation: English title and content are required
        if (!payload.title.en || !payload.content.en) {
            alert('English title and content are required.');
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const res = blog
                ? await axios.put(`/api/blogs/${blog._id}`, payload, { headers: { Authorization: token } })
                : await axios.post('/api/blogs', payload, { headers: { Authorization: token } });

            onSave(res.data); // Callback to parent component
            setFormData(initialBlogState); // Reset form
        } catch (error) {
            console.error('Error saving blog:', error);
            alert('Error saving blog: ' + (error.response?.data?.message || error.message));
        }
    };

    // Quill editor modules configuration
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link'], // We removed 'image' because we have a separate uploader
            ['clean']
        ],
    };

    return (
        <form onSubmit={onSubmit} className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col gap-6 max-w-4xl mx-auto">
            {/* Language Tabs */}
            <div className="flex border-b border-gray-300 dark:border-gray-700">
                {languages.map(lang => (
                    <button
                        key={lang.value}
                        type="button"
                        onClick={() => setActiveLang(lang.value)}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${activeLang === lang.value
                                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
                            }`}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>

            {/* Title Input */}
            <input
                name="title"
                className="border border-gray-300 dark:border-gray-600 p-3 rounded-md w-full bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                placeholder={`Title (${activeLang.toUpperCase()})`}
                value={formData.title[activeLang]}
                onChange={handleInputChange}
                required={activeLang === 'en'} // Only English title is mandatory
            />

            {/* Rich Text Editor (ReactQuill) */}
            <div>
                <label className="block font-medium text-sm mb-2 text-gray-700 dark:text-gray-300">
                    Content ({activeLang.toUpperCase()})
                </label>
                <ReactQuill
                    theme="snow"
                    value={formData.content[activeLang]}
                    onChange={handleContentChange}
                    modules={quillModules}
                    className="bg-white dark:bg-gray-800"
                />
            </div>

            {/* Image Uploader */}
            <div>
                <label className="block font-medium text-sm mb-2 text-gray-700 dark:text-gray-300">
                    Upload Images
                </label>
                <input
                    type="file"
                    accept="image/*"
                    multiple // Allow multiple files
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
                {/* Image Preview Area */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.images.map(url => (
                        <div key={url} className="relative group">
                            <img src={url} alt="Uploaded preview" className="h-32 w-full object-cover rounded-md border border-gray-200" />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(url)}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                &#x2715;
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tags Input */}
            <input
                name="tags"
                className="border border-gray-300 dark:border-gray-600 p-3 rounded-md w-full bg-gray-50 dark:bg-gray-800"
                placeholder="Tags (comma separated)"
                value={formData.tags}
                onChange={handleInputChange}
            />

            {/* Submit Button */}
            <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold transition-colors w-full md:w-auto self-end"
                type="submit"
                disabled={uploading}
            >
                {uploading ? 'Waiting for upload...' : (blog ? 'Update Blog' : 'Publish Blog')}
            </button>
        </form>
    );
};

export default AdminBlogForm;
