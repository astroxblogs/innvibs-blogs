// client/src/pages/CategoryManager.js
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

const CategoryManager = () => {
    const { register, handleSubmit, reset } = useForm();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/admin/categories');
            setCategories(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to fetch categories. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const onSubmit = async (data) => {
        try {
            await api.post('/api/admin/categories', {
                name_en: data.name_en,
                name_hi: data.name_hi
            });
            alert('Category added successfully!');
            reset();
            fetchCategories(); // Refresh the list
        } catch (err) {
            console.error('Error adding category:', err);
            alert('Failed to add category: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await api.delete(`/api/admin/categories/${categoryId}`);
                alert('Category deleted successfully!');
                fetchCategories(); // Refresh the list
            } catch (err) {
                console.error('Error deleting category:', err);
                alert('Failed to delete category: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    if (loading) {
        return <div className="text-center p-6 text-gray-500">Loading categories...</div>;
    }

    if (error) {
        return <div className="text-center p-6 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Category Management</h2>

            {/* Form to Add New Category */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Add New Category</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="name_en" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Category Name (English)
                        </label>
                        <input
                            type="text"
                            id="name_en"
                            {...register('name_en', { required: true })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="name_hi" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Category Name (Hindi)
                        </label>
                        <input
                            type="text"
                            id="name_hi"
                            {...register('name_hi')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Add Category
                    </button>
                </form>
            </div>

            {/* List of Existing Categories */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Existing Categories</h3>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {categories.map((category) => (
                        <li key={category._id} className="flex justify-between items-center py-4">
                            <span className="text-lg text-gray-900 dark:text-gray-100">{category.name_en}</span>
                            <button
                                onClick={() => handleDelete(category._id)}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-500"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CategoryManager;