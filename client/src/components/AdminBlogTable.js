import React, { useState } from 'react';

const AdminBlogTable = ({ blogs, onEdit, onDelete }) => {
    const [deleteId, setDeleteId] = useState(null);

    return (
        <div className="overflow-x-auto rounded-lg shadow mt-8">
            <table className="min-w-full bg-white dark:bg-gray-900">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">Title</th>
                        {/* UPDATED: Changed table header from Language to Category */}
                        <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">Category</th>
                        <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">Date</th>
                        <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map((blog) => (
                        <tr key={blog._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{blog.title}</td>
                            {/* UPDATED: Displaying blog.category instead of blog.language */}
                            <td className="p-4 text-gray-600 dark:text-gray-300">{blog.category}</td>
                            <td className="p-4 text-gray-500 dark:text-gray-400">{new Date(blog.date).toLocaleDateString()}</td>
                            <td className="p-4">
                                <button className="text-green-600 hover:underline mr-4" onClick={() => onEdit(blog)}>Edit</button>
                                <button className="text-red-600 hover:underline" onClick={() => setDeleteId(blog._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Delete Confirmation Modal (No changes needed here) */}
            {deleteId && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-lg max-w-sm w-full">
                        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Confirm Delete</h2>
                        <p className="mb-6 text-gray-700 dark:text-gray-300">Are you sure you want to delete this blog?</p>
                        <div className="flex justify-end gap-4">
                            <button className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700" onClick={() => setDeleteId(null)}>Cancel</button>
                            <button className="px-4 py-2 rounded bg-red-600 text-white" onClick={() => { onDelete(deleteId); setDeleteId(null); }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBlogTable;