import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';

// Register the resize module with Quill
Quill.register('modules/imageResize', ImageResize);

// Define supported languages for the admin interface
// These should match the language codes used in your i18n setup and database fields
const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
];

const categories = [
    'Technology', 'Fashion', 'Health & Wellness', 'Travel',
    'Food & Cooking', 'Sports', 'Business & Finance', 'Lifestyle'
];

const AdminBlogForm = ({ blog, onSave }) => {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const [activeLang, setActiveLang] = useState('en'); // State to manage active language tab
    const [contents, setContents] = useState(() => { // State to hold content for all languages
        const initialContents = {};
        LANGUAGES.forEach(lang => {
            initialContents[lang.code] = '';
        });
        return initialContents;
    });

    const quillRef = React.useRef(null);

    // Custom image handler function for ReactQuill
    const imageHandler = useCallback(() => {
        const editor = quillRef.current.getEditor();
        const url = prompt('Enter the image URL'); // Show a popup to paste the URL
        if (url) {
            const range = editor.getSelection();
            editor.insertEmbed(range.index, 'image', url);
        }
    }, []);

    // Memoize Quill modules to prevent re-creation on every render
    const modules = useMemo(() => ({
        imageResize: {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize', 'Toolbar']
        },
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                [{ 'font': [] }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'align': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler,
            },
        },
    }), [imageHandler]); // Dependency on imageHandler to ensure it's stable


    // Effect to populate form when editing an existing blog
    useEffect(() => {
        const newContents = {};
        if (blog) {
            // Populate form fields for react-hook-form
            reset(blog); // Resets all fields including original title/content, image, tags, category

            // Manually set language-specific titles
            LANGUAGES.forEach(lang => {
                setValue(`title_${lang.code}`, blog[`title_${lang.code}`] || '');
                newContents[lang.code] = blog[`content_${lang.code}`] || '';
            });
            // Fallback for original `title` and `content` if `title_en`/`content_en` are not present (for old blogs)
            setValue('title', blog.title || '');
            newContents['en'] = newContents['en'] || blog.content || ''; // Use English as primary fallback

            setContents(newContents);
        } else {
            // Reset form for new blog
            reset({
                title: '',
                image: '',
                tags: '',
                category: categories[0]
            });
            const clearedContents = {};
            LANGUAGES.forEach(lang => {
                clearedContents[lang.code] = '';
                setValue(`title_${lang.code}`, ''); // Clear language-specific title inputs
            });
            setContents(clearedContents);
            setActiveLang('en'); // Reset to English tab
        }
    }, [blog, reset, setValue]);

    const onSubmit = async (data) => {
        const tags = typeof data.tags === 'string' ? data.tags.split(',').map(tag => tag.trim()) : [];

        // Prepare the payload including all language-specific fields
        const payload = {
            image: data.image,
            tags,
            category: data.category,
            // Include original title/content as fallback/default (e.g., for compatibility)
            title: data.title_en || data.title, // Use title_en, fallback to original title
            content: contents.en || data.content, // Use content_en, fallback to original content
        };

        // Add all language-specific titles and contents
        LANGUAGES.forEach(lang => {
            payload[`title_${lang.code}`] = data[`title_${lang.code}`];
            payload[`content_${lang.code}`] = contents[lang.code];
        });

        try {
            const res = blog
                ? await axios.put(`/api/blogs/${blog._id}`, payload)
                : await axios.post('/api/blogs', payload);
            onSave(res.data);
            // After successful save, reset form and contents
            reset();
            const clearedContents = {};
            LANGUAGES.forEach(lang => clearedContents[lang.code] = '');
            setContents(clearedContents);
            setActiveLang('en');
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
            {/* Language Selection Tabs */}
            <div className="flex justify-center border-b border-gray-200 dark:border-gray-700 mb-4">
                {LANGUAGES.map(lang => (
                    <button
                        key={lang.code}
                        type="button" // Important: Prevent form submission
                        onClick={() => setActiveLang(lang.code)}
                        className={`
                            px-4 py-2 text-sm font-medium
                            ${activeLang === lang.code
                                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                            }
                            focus:outline-none transition-colors duration-200
                        `}
                    >
                        {lang.name}
                    </button>
                ))}
            </div>

            {/* Common Fields */}
            <input
                className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                placeholder="Main Cover Image URL"
                {...register('image')}
            />
            <input
                className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                placeholder="Tags (comma separated)"
                {...register('tags')}
            />
            <select
                className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                {...register('category', { required: true })}
            >
                {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>

            {/* Language-specific Fields */}
            {LANGUAGES.map(lang => (
                <div key={lang.code} style={{ display: activeLang === lang.code ? 'block' : 'none' }}>
                    <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-800 dark:text-gray-200">
                        {lang.name} Content
                    </h3>
                    <input
                        className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full mb-4 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                        placeholder={`Title (${lang.name})`}
                        // Register input with dynamic name like 'title_en', 'title_es'
                        {...register(`title_${lang.code}`, { required: lang.code === 'en' })}
                    />

                    <div>
                        <label className="block font-medium text-sm mb-1 text-gray-700 dark:text-gray-300">
                            Content ({lang.name})
                        </label>
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={contents[lang.code]} // Use content for the active language
                            onChange={(value) => setContents(prev => ({ ...prev, [lang.code]: value }))} // Update specific language content
                            modules={modules}
                            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            ))}

            <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold transition-colors w-full md:w-auto self-end mt-4"
                type="submit"
            >
                {blog ? 'Update' : 'Add'} Blog
            </button>
        </form>
    );
};

export default AdminBlogForm;