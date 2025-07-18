import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import axios from 'axios';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// --- Configuration ---
const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'fr', label: 'French' },
    { value: 'es', label: 'Spanish' }
];

const CLOUDINARY_UPLOAD_PRESET = 'Myblogs'; // Replace with your preset
const CLOUDINARY_CLOUD_NAME = 'dsoeem7bp'; // Replace with your cloud name

// --- Editor Toolbar and Style Configuration ---
const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48];
const customStyleMap = fontSizes.reduce((map, size) => {
    map[`font-size-${size}`] = { fontSize: `${size}px` };
    return map;
}, {});

// --- Helper to create empty editor states ---
const createEmptyEditorStates = () => {
    return languages.reduce((acc, lang) => {
        acc[lang.value] = EditorState.createEmpty();
        return acc;
    }, {});
};


const AdminBlogForm = ({ blog, onSave }) => {
    const { register, handleSubmit, reset, setValue, getValues } = useForm();
    const [uploading, setUploading] = useState(false);
    const [currentLang, setCurrentLang] = useState('en');
    const [editorStates, setEditorStates] = useState(createEmptyEditorStates);

    useEffect(() => {
        if (blog) {
            const newEditorStates = {};
            languages.forEach(lang => {
                const contentHtml = blog.content?.[lang.value] || '';
                const contentBlock = htmlToDraft(contentHtml);
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                newEditorStates[lang.value] = EditorState.createWithContent(contentState);
            });
            setEditorStates(newEditorStates);

            reset({
                title: blog.title,
                image: blog.image,
                categories: Array.isArray(blog.categories) ? blog.categories.join(', ') : ''
            });
        } else {
            reset({ title: { en: '', hi: '', fr: '', es: '' }, image: '', categories: '' });
            setEditorStates(createEmptyEditorStates());
        }
    }, [blog, reset]);

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
        return res.data.secure_url;
    };

    const handleFeaturedImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const uploadedUrl = await uploadToCloudinary(file);
            setValue('image', uploadedUrl);
        } catch (err) {
            console.error('Featured image upload failed:', err);
            alert('Featured image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const uploadImageCallback = async (file) => {
        try {
            const uploadedUrl = await uploadToCloudinary(file);
            return { data: { link: uploadedUrl } };
        } catch (error) {
            console.error('Editor image upload failed:', error);
            return { error: { message: 'Image upload failed' } };
        }
    };

    const handleEditorStateChange = useCallback((newState, lang) => {
        setEditorStates(prev => ({ ...prev, [lang]: newState }));
    }, []);

    const onSubmit = async (data) => {
        const token = localStorage.getItem('adminToken');
        const contentPayload = {};
        for (const lang of languages) {
            const rawContentState = convertToRaw(editorStates[lang.value].getCurrentContent());
            contentPayload[lang.value] = draftToHtml(rawContentState);
        }

        const payload = {
            title: data.title,
            content: contentPayload,
            image: data.image,
            categories: data.categories ? data.categories.split(',').map(c => c.trim()).filter(Boolean) : [],
        };

        try {
            const res = blog
                ? await axios.put(`/api/blogs/${blog._id}`, payload, { headers: { Authorization: token } })
                : await axios.post('/api/blogs', payload, { headers: { Authorization: token } });

            onSave(res.data);
            reset({ title: { en: '', hi: '', fr: '', es: '' }, image: '', categories: '' });
            setEditorStates(createEmptyEditorStates());
            setCurrentLang('en');
        } catch (error) {
            console.error('Error saving blog:', error);
            alert('Error saving blog: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mb-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow flex flex-col gap-6 max-w-4xl mx-auto"
        >
            <div className="flex border-b border-gray-300 dark:border-gray-700">
                {languages.map(lang => (
                    <button
                        type="button"
                        key={lang.value}
                        onClick={() => setCurrentLang(lang.value)}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${currentLang === lang.value
                                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>

            {languages.map(lang => (
                <div key={lang.value} className={currentLang === lang.value ? 'block' : 'hidden'}>
                    <div className="flex flex-col gap-6">
                        <input
                            className="border border-gray-300 dark:border-gray-700 p-3 rounded w-full text-lg font-semibold"
                            placeholder={`${lang.label} Title`}
                            {...register(`title.${lang.value}`, { required: true })}
                        />
                        <div>
                            <label className="block font-medium text-sm mb-2 text-gray-700 dark:text-gray-300">
                                {lang.label} Content
                            </label>
                            <Editor
                                editorState={editorStates[lang.value]}
                                onEditorStateChange={(newState) => handleEditorStateChange(newState, lang.value)}
                                customStyleMap={customStyleMap}
                                wrapperClassName="border border-gray-300 dark:border-gray-700 rounded"
                                editorClassName="p-4 min-h-[250px] bg-white dark:bg-gray-900"
                                toolbarClassName="!border-b border-gray-300 dark:border-gray-700"
                                toolbar={{
                                    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'image', 'remove', 'history'],
                                    blockType: { inDropdown: true, options: ['Normal', 'H1', 'H2', 'H3', 'Blockquote', 'Code'] },
                                    fontSize: { options: fontSizes },
                                    image: { uploadCallback: uploadImageCallback, alt: { present: true, mandatory: false }, previewImage: true },
                                }}
                            />
                        </div>
                    </div>
                </div>
            ))}

            <div>
                <label className="block font-medium text-sm mb-2 text-gray-700 dark:text-gray-300">
                    Featured Image (Optional)
                </label>
                <input type="file" accept="image/*" onChange={handleFeaturedImageUpload} />
                {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                {getValues('image') && (
                    <img src={getValues('image')} alt="Preview" className="mt-2 h-40 object-contain border rounded" />
                )}
            </div>

            <input
                className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full"
                placeholder="Categories (comma separated, e.g., tech, astronomy)"
                {...register('categories')}
            />

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