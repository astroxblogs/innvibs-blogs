 

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageResize', ImageResize);

const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
];

const categories = [
    'Technology', 'Fashion', 'Health & Wellness', 'Travel',
    'Food & Cooking', 'Sports', 'Business & Finance', 'Lifestyle',
    'Trends',
    'Relationship'
];

const AdminBlogForm = ({ blog, onSave }) => {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const [activeLang, setActiveLang] = useState('en');
    const [contents, setContents] = useState(() => {
        const initialContents = {};
        LANGUAGES.forEach(lang => {
            initialContents[lang.code] = '';
        });
        return initialContents;
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef(null);

    const quillRef = useRef(null);

    const extractFirstImageUrl = (htmlContent) => {
        if (!htmlContent) return null;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const img = doc.querySelector('img');
        return img ? img.src : null;
    };

    const quillImageUploadHandler = useCallback(() => {
        
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('image', file);

            try {
                const editor = quillRef.current?.getEditor();
                if (!editor) {
                    console.error('Quill editor instance not found.');
                    alert('Quill editor not ready. Please try again.');
                    return;
                }

                const range = editor.getSelection();
                const cursorIndex = range ? range.index : 0;
                editor.insertEmbed(cursorIndex, 'text', 'Uploading image...');

                const res = await axios.post('/api/blogs/upload-image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const imageUrl = res.data.imageUrl;

                editor.deleteText(cursorIndex, 16);
                editor.insertEmbed(cursorIndex, 'image', imageUrl);

             

            } catch (error) {
                console.error('Error uploading image to backend for Quill:', error.response?.data || error.message);
                alert('Error uploading image to content: ' + (error.response?.data?.error || error.message));

                const editor = quillRef.current?.getEditor();
                if (editor) {
                    const range = editor.getSelection();
                    if (range && editor.getText(range.index - 16, 16) === 'Uploading image...') {
                        editor.deleteText(range.index - 16, 16);
                    } else if (editor.getText(0, 16) === 'Uploading image...') {
                        editor.deleteText(0, 16);
                    }
                }
            }
        };
    
    }, []) // activeLang is still needed if you want to update the main cover logic based on content from a specific language

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
                image: quillImageUploadHandler,
            },
        },
    }), [quillImageUploadHandler]);

    useEffect(() => {
        const newContents = {};
        if (blog) {
            reset(blog);
            LANGUAGES.forEach(lang => {
                setValue(`title_${lang.code}`, blog[`title_${lang.code}`] || '');
                newContents[lang.code] = blog[`content_${lang.code}`] || '';
            });
            setValue('title', blog.title || '');
            newContents['en'] = newContents['en'] || blog.content || '';

            setContents(newContents);
            setValue('image', blog.image || '');

            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } else {
            reset({
                title: '',
                image: '',
                tags: '',
                category: categories[0]
            });
            const clearedContents = {};
            LANGUAGES.forEach(lang => clearedContents[lang.code] = '');
            setContents(clearedContents);
            setActiveLang('en');
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [blog, reset, setValue]);

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
            setValue('image', '');
        } else {
            setSelectedFile(null);
        }
    };

    const uploadMainCoverImage = async () => {
        if (!selectedFile) return;

        setUploadingImage(true);
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const res = await axios.post('/api/blogs/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const imageUrl = res.data.imageUrl;
            setValue('image', imageUrl);
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            alert('Main cover image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading main cover image to backend:', error.response?.data || error.message);
            alert('Error uploading main cover image: ' + (error.response?.data?.error || error.message));
        } finally {
            setUploadingImage(false);
        }
    };

    const onSubmit = async (data) => {
        const tags = typeof data.tags === 'string' ? data.tags.split(',').map(tag => tag.trim()) : [];

        let finalImageUrl = data.image;

        if (!finalImageUrl && !selectedFile) {
            finalImageUrl = extractFirstImageUrl(contents.en);
        }

        if (finalImageUrl) {
            finalImageUrl = finalImageUrl.trim();
        }

        const payload = {
            image: finalImageUrl,
            tags,
            category: data.category,
            title: data.title_en || data.title,
            content: contents.en || data.content,
        };

        LANGUAGES.forEach(lang => {
            payload[`title_${lang.code}`] = data[`title_${lang.code}`];
            payload[`content_${lang.code}`] = contents[lang.code];
        });

        payload.title = data.title_en || data.title;
        payload.content = contents.en || data.content;


        try {
            const res = blog
                ? await axios.put(`/api/blogs/${blog._id}`, payload)
                : await axios.post('/api/blogs', payload);
            onSave(res.data);
            reset();
            const clearedContents = {};
            LANGUAGES.forEach(lang => clearedContents[lang.code] = '');
            setContents(clearedContents);
            setActiveLang('en');
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            alert(blog ? "Blog updated successfully!" : "Blog added successfully!");
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
                        type="button"
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


            <div className="flex flex-col gap-2">
                <label className="block font-medium text-sm text-gray-700 dark:text-gray-300">
                    Main Cover Image
                </label>
                <input
                    className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                    placeholder="Paste Image URL"
                    {...register('image')}
                />
                <div className="flex items-center gap-2">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="block w-full text-sm text-gray-900 dark:text-white
                                     file:mr-4 file:py-2 file:px-4
                                     file:rounded-md file:border-0
                                     file:text-sm file:font-semibold
                                     file:bg-blue-50 file:text-blue-700
                                     hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300
                                     dark:hover:file:bg-blue-800"
                    />
                    {selectedFile && (
                        <button
                            type="button"
                            onClick={uploadMainCoverImage}
                            disabled={uploadingImage}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        >
                            {uploadingImage ? 'Uploading...' : 'Upload Image'}
                        </button>
                    )}
                </div>
                {watch('image') && (
                    <div className="mt-2 text-center">
                        <img src={watch('image')} alt="Cover Preview" className="max-h-48 object-contain mx-auto rounded-md shadow-md" />
                    </div>
                )}
            </div>

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

            {
                LANGUAGES.map(lang => (
                    activeLang === lang.code && (
                        <div key={lang.code}>
                            <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-800 dark:text-gray-200">
                                {lang.name} Content
                            </h3>
                            <input
                                className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full mb-4 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                                placeholder={`Title (${lang.name})`}
                                {...register(`title_${lang.code}`, { required: lang.code === 'en' })}
                            />

                            <div>
                                <label className="block font-medium text-sm mb-1 text-gray-700 dark:text-gray-300">
                                    Content ({lang.name})
                                </label>
                                <ReactQuill
                                    ref={quillRef}
                                    theme="snow"
                                    value={contents[lang.code]}
                                    onChange={(value) => setContents(prev => ({ ...prev, [lang.code]: value }))}
                                    modules={modules}
                                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white admin-quill-editor"
                                />
                            </div>
                        </div>
                    )
                ))
            }

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