import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const AdminBlogTable = ({ blogs, onEdit, onDelete }) => {
    const { t } = useTranslation(); // Initialize t function
    const [deleteId, setDeleteId] = useState(null);

    return (
        <div className="overflow-x-auto rounded-lg shadow mt-8">
            <table className="min-w-full bg-white dark:bg-gray-900">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        {/* Using translation keys for table headers */}
                        <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">{t('Title')}</th>
                        <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">{t('Category')}</th> {/* Changed key for category header */}
                        <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">{t('Date')}</th>
                        <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">{t('Actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map((blog) => (
                        <tr key={blog._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            {/* Display blog.title_en (English title) or fallback to blog.title */}
                            <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{blog.title_en || blog.title}</td>
                            <td className="p-4 text-gray-600 dark:text-gray-300">{blog.category}</td>
                            <td className="p-4 text-gray-500 dark:text-gray-400">{new Date(blog.date).toLocaleDateString()}</td>
                            <td className="p-4">
                                {/* Using translation keys for action buttons */}
                                <button className="text-green-600 hover:underline mr-4" onClick={() => onEdit(blog)}>{t('Edit')}</button>
                                <button className="text-red-600 hover:underline" onClick={() => setDeleteId(blog._id)}>{t('Delete')}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-lg max-w-sm w-full">
                        {/* Using new translation keys for modal */}
                        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">{t('confirm delete title')}</h2>
                        <p className="mb-6 text-gray-700 dark:text-gray-300">{t('confirm delete message')}</p>
                        <div className="flex justify-end gap-4">
                            {/* Using translation key for Cancel button */}
                            <button className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700" onClick={() => setDeleteId(null)}>{t('Cancel')}</button>
                            <button className="px-4 py-2 rounded bg-red-600 text-white" onClick={() => { onDelete(deleteId); setDeleteId(null); }}>{t('Delete')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBlogTable;