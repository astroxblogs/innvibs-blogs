// client/src/components/FeaturedBlogCarousel.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FeaturedBlogCarousel = ({ blogs }) => {
    // State to keep track of the currently displayed blog index
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-scrolling effect
    useEffect(() => {
        if (!blogs || blogs.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                (prevIndex + 1) % blogs.length
            );
        }, 5000); // Change blog every 5 seconds (adjust as needed, 2-3s might be too fast for reading)

        // Cleanup the interval when the component unmounts or blogs change
        return () => clearInterval(interval);
    }, [blogs]); // Re-run effect if the blogs prop changes

    if (!blogs || blogs.length === 0) {
        return null; // Or a loading spinner, or a fallback message
    }

    const currentBlog = blogs[currentIndex];

    // Helper to strip HTML tags for the excerpt, similar to what we did for BlogCard
    const getPlainTextExcerpt = (htmlContent, maxLength = 200) => {
        if (!htmlContent) return '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        let text = tempDiv.textContent || tempDiv.innerText || '';
        text = text.replace(/\s\s+/g, ' ').trim();
        return text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');
    };


    return (
        <section className="relative w-full h-[500px] overflow-hidden bg-gray-900 text-white">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
                style={{ backgroundImage: `url(${currentBlog.image})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex items-end h-full p-6 md:p-12 max-w-4xl mx-auto">
                <div className="pb-8 md:pb-12">
                    {/* Tags */}
                    {currentBlog.tags && currentBlog.tags.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-2 text-sm text-gray-300">
                            {currentBlog.tags.map(tag => (
                                <span key={tag} className="bg-gray-700 px-2 py-0.5 rounded-full text-xs">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
                        {currentBlog.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-lg text-gray-200 mb-6 line-clamp-3">
                        {getPlainTextExcerpt(currentBlog.content, 200)}
                    </p>

                    {/* Read More Button */}
                    <Link
                        to={`/blog/${currentBlog._id}`}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200"
                    >
                        Read Blog
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </Link>
                </div>
            </div>

            {/* Navigation Dots (Optional: for visual indication) */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
                {blogs.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-3 h-3 mx-1 rounded-full transition-all duration-300 ${currentIndex === idx ? 'bg-white scale-125' : 'bg-gray-400'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    ></button>
                ))}
            </div>
        </section>
    );
};

export default FeaturedBlogCarousel;