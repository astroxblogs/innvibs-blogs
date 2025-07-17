import React, { useState } from 'react';

// THIS IS A TEMPORARY DIAGNOSTIC VERSION TO FIND THE ERROR
const AdminBlogTable = ({ blogs, onEdit, onDelete }) => {
    const [deleteId, setDeleteId] = useState(null);

    return (
        <div className="overflow-x-auto rounded-lg shadow-md mt-8 border border-gray-200 dark:border-gray-700">
            {/* <h2 className="p-4 text-red-500 font-bold">DIAGNOSTIC MODE ACTIVE</h2> */}
            <table className="min-w-full bg-white dark:bg-gray-900">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Title</th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Date</th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(blogs) && blogs.map((blog) => (
                        <tr key={blog._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">

                            {/* THIS IS THE TEST. 
                              We are not trying to access blog.title at all.
                              We are just rendering a simple string.
                            */}
                            {/* <td className="p-4 font-medium text-green-500">TESTING TITLE</td> */}

                            <td className="p-4 text-gray-500">
                                {new Date(blog.date).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                                <button className="text-blue-600" onClick={() => onEdit(blog)}>Edit</button>
                                <button className="text-red-600 ml-4" onClick={() => setDeleteId(blog._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminBlogTable;

