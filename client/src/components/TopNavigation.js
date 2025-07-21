import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
// 1. Import the Globe icon
import { Search, X, ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

const categories = [
    { label: "All", value: "all" },
    { label: "Technology", value: "Technology" },
    { label: "Fashion", value: "Fashion" },
    { label: "Health & Wellness", value: "Health & Wellness" },
    { label: "Travel", value: "Travel" },
    { label: "Food & Cooking", value: "Food & Cooking" },
    { label: "Sports", value: "Sports" },
    { label: "Business & Finance", value: "Business & Finance" },
    { label: "Lifestyle", value: "Lifestyle" },
];

const MAX_VISIBLE_CATEGORIES = 5;

const TopNavigation = ({ activeCategory, onCategoryChange, setSearchQuery }) => {
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [startIndex, setStartIndex] = useState(0);
    // 2. Add state to control the visibility of the translate dropdown
    const [showTranslate, setShowTranslate] = useState(false);

    // This effect finds the Google Translate widget and moves it into our custom container
    useEffect(() => {
        // Only run this logic if the user wants to see the dropdown
        if (showTranslate) {
            const interval = setInterval(() => {
                const googleWidget = document.querySelector('.skiptranslate');
                const customContainer = document.getElementById('google_translate_custom_container');

                if (googleWidget && customContainer) {
                    // Move the widget into our container if it's not already there
                    if (!customContainer.contains(googleWidget)) {
                        customContainer.appendChild(googleWidget);
                    }
                    // Style the dropdown to match the site's theme
                    const select = googleWidget.querySelector('select');
                    if (select) {
                        select.className = 'bg-light-bg-secondary dark:bg-dark-bg-secondary text-text-dark dark:text-text-light border border-border-light dark:border-border-dark rounded-md p-1 focus:outline-none';
                    }
                    clearInterval(interval); // Stop checking once it's moved
                }
            }, 100); // Check every 100ms

            return () => clearInterval(interval);
        }
    }, [showTranslate]); // This effect runs when `showTranslate` changes

    const handleNext = () => setStartIndex(prev => Math.min(prev + 1, categories.length - MAX_VISIBLE_CATEGORIES));
    const handlePrev = () => setStartIndex(prev => Math.max(prev - 1, 0));
    const handleCategoryClick = (categoryValue) => onCategoryChange(categoryValue);
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        setSearchQuery(inputValue);
    };
    const handleCloseSearch = () => {
        setShowSearchInput(false);
        setInputValue('');
        setSearchQuery('');
    };
    const handleSearchClick = () => setShowSearchInput(true);

    const showLeftArrow = categories.length > MAX_VISIBLE_CATEGORIES && startIndex > 0;
    const showRightArrow = categories.length > MAX_VISIBLE_CATEGORIES && startIndex < categories.length - MAX_VISIBLE_CATEGORIES;

    return (
        <nav className="sticky top-0 z-50 bg-light-bg-secondary dark:bg-dark-bg-secondary shadow-sm">
            <div className="py-3 px-4 md:px-8 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-text-dark dark:text-text-light flex-shrink-0">
                    <img src="/logo.png" alt="AstroXHub Logo" className="h-8 w-8" />
                    <span>AstroXHub</span>
                </Link>

                {/* Category Navigation (No changes here) */}
                <div className="flex-grow flex justify-center items-center">
                    <div className="flex items-center">
                        <AnimatePresence>
                            {showLeftArrow && (
                                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                                    <button onClick={handlePrev} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-2" aria-label="Previous categories">
                                        <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div className="flex items-center space-x-3 whitespace-nowrap">
                            {categories.slice(startIndex, startIndex + MAX_VISIBLE_CATEGORIES).map((cat) => (
                                <button key={cat.value} onClick={() => handleCategoryClick(cat.value)} className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${activeCategory === cat.value ? "bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900" : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"}`}>
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                        <AnimatePresence>
                            {showRightArrow && (
                                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                                    <button onClick={handleNext} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ml-2" aria-label="Next categories">
                                        <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Side Controls */}
                <div className="flex items-center space-x-3 flex-shrink-0">
                    {showSearchInput ? (
                        <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1.5 w-full max-w-xs">
                            <input id="search-blog-input" type="text" placeholder="Search..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="bg-transparent focus:outline-none text-text-dark dark:text-text-light w-full" />
                            <button onClick={handleCloseSearch} type="button" className="ml-2 text-gray-500 hover:text-red-500" aria-label="Close search">
                                <X className="w-5 h-5" />
                            </button>
                        </form>
                    ) : (
                        <button onClick={handleSearchClick} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" aria-label="Open search">
                            <Search className="w-6 h-6" />
                        </button>
                    )}

                    {/* 3. Add the Google Translate trigger icon and dropdown container */}
                    <div className="relative">
                        <button onClick={() => setShowTranslate(!showTranslate)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" aria-label="Translate page">
                            <Globe className="w-6 h-6" />
                        </button>
                        {showTranslate && (
                            <div id="google_translate_custom_container" className="absolute top-full right-0 mt-2 p-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border dark:border-border-dark rounded-md shadow-lg">
                                {/* The Google Translate dropdown will be moved here */}
                            </div>
                        )}
                    </div>

                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
};

export default TopNavigation;