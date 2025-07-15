import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const CommentSection = ({ blogId, initialComments }) => {
    const { t } = useTranslation();
    const [comments, setComments] = useState(initialComments || []);
    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !comment) return;
        setLoading(true);
        try {
            const res = await axios.post(`/api/blogs/${blogId}/comments`, { name, comment });
            setComments([...comments, res.data]);
            setName('');
            setComment('');
        } catch (err) { }
        setLoading(false);
    };

    return (
        <section className="mt-10">
            <h3 className="text-xl font-semibold mb-4">{t('comment')}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 mb-6">
                <input
                    className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder={t('name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder={t('your_comment')}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                />
                <button
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold transition-colors"
                    type="submit"
                    disabled={loading}
                >
                    {t('submit')}
                </button>
            </form>
            <div className="space-y-4">
                {comments.map((c, idx) => (
                    <div key={idx} className="rounded-lg bg-gray-100 dark:bg-gray-800 p-4">
                        <div className="font-bold text-gray-800 dark:text-gray-200 mb-1">{c.name}</div>
                        <div className="text-gray-700 dark:text-gray-300 mb-1">{c.comment}</div>
                        <div className="text-xs text-gray-500">{new Date(c.timestamp).toLocaleString()}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CommentSection; 