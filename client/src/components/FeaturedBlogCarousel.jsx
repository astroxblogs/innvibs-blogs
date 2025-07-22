import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next'; // <-- Import useTranslation

const FeaturedBlogCarousel = ({ blogs }) => {
    const { i18n, t } = useTranslation(); // <-- Get i18n instance and t function
    const currentLang = i18n.language;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false); // State to track image loading

    // Function to get the language-specific title and content (re-used from BlogCard)
    const getLocalizedContent = (field, blogData, lang) => {
        const localizedField = blogData[`${field}_${lang}`];
        if (localizedField) {
            return localizedField;
        }
        if (blogData[`${field}_en`]) {
            return blogData[`${field}_en`];
        }
        return blogData[field] || '';
    };

    useEffect(() => {
        if (!blogs || blogs.length === 0) return;

        // Reset imageLoaded state when the current index changes
        // This ensures the fade-in animation triggers for each new image
        setImageLoaded(false);

        // Preload the image to ensure it's in cache before setting background
        const img = new Image();
        img.src = blogs[currentIndex].image;
        img.onload = () => setImageLoaded(true);
        img.onerror = () => {
            console.error("Failed to load carousel image:", blogs[currentIndex].image);
            setImageLoaded(true); // Still set to true to avoid infinite loading state
        };

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % blogs.length);
        }, 5000); // Auto-slide every 5 seconds
        return () => clearInterval(interval);
    }, [blogs, currentIndex]); // Rerun when blogs or currentIndex changes

    if (!blogs || blogs.length === 0) {
        return null;
    }

    const currentBlog = blogs[currentIndex];
    const displayTitle = getLocalizedContent('title', currentBlog, currentLang);
    const displayContent = getLocalizedContent('content', currentBlog, currentLang);


    const getPlainTextExcerpt = (markdownContent, maxLength = 200) => {
        if (!markdownContent) return '';

        const html = marked.parse(markdownContent);

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        let text = tempDiv.textContent || tempDiv.innerText || '';
        text = text.replace(/\s\s+/g, ' ').trim();

        return text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');
    };

    const excerpt = getPlainTextExcerpt(displayContent, 200);

    return (
        <section className="relative w-full h-[500px] overflow-hidden bg-gray-900 text-white">
            <div
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
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
                        {displayTitle} {/* Translated blog title */}
                    </h2>

                    <p className="text-lg text-gray-200 mb-6 line-clamp-3">
                        {excerpt} {/* Translated excerpt */}
                    </p>

                    <Link
                        to={`/blog/${currentBlog._id}`}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200"
                    >
                        {t('blog_card.read_more')} {/* Translated "Read Blog" button */}
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