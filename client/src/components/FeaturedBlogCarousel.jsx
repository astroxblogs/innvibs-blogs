import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { marked } from 'marked'; // 1. Import the 'marked' library

const FeaturedBlogCarousel = ({ blogs }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!blogs || blogs.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % blogs.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [blogs]);

    if (!blogs || blogs.length === 0) {
        return null;
    }

    const currentBlog = blogs[currentIndex];

    // 2. Update the excerpt function to handle Markdown
    const getPlainTextExcerpt = (markdownContent, maxLength = 200) => {
        if (!markdownContent) return '';

        // First, convert the Markdown to an HTML string
        const html = marked.parse(markdownContent);

        // Then, use a temporary element to strip the HTML tags to get plain text
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        let text = tempDiv.textContent || tempDiv.innerText || '';
        text = text.replace(/\s\s+/g, ' ').trim();

        // Return a snippet of the plain text
        return text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');
    };

    return (
        <section className="relative w-full h-[500px] overflow-hidden bg-gray-900 text-white">
            <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
                style={{ backgroundImage: `url(${currentBlog.image})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
            </div>

            <div className="relative z-10 flex items-end h-full p-6 md:p-12 max-w-4xl mx-auto">
                <div className="pb-8 md:pb-12">
                    {currentBlog.tags && currentBlog.tags.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-2 text-sm text-gray-300">
                            {currentBlog.tags.map(tag => (
                                <span key={tag} className="bg-gray-700 px-2 py-0.5 rounded-full text-xs">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
                        {currentBlog.title}
                    </h2>

                    {/* This will now display the clean, plain-text excerpt */}
                    <p className="text-lg text-gray-200 mb-6 line-clamp-3">
                        {getPlainTextExcerpt(currentBlog.content, 200)}
                    </p>

                    <Link
                        to={`/blog/${currentBlog._id}`}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200"
                    >
                        Read Blog
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </Link>
                </div>
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
                {blogs.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-3 h-3 mx-1 rounded-full transition-all duration-300 ${currentIndex === idx ? 'bg-white scale-125' : 'bg-gray-400'}`}
                        aria-label={`Go to slide ${idx + 1}`}
                    ></button>
                ))}
            </div>
        </section>
    );
};

export default FeaturedBlogCarousel;