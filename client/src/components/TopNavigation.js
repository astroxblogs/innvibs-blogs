// client/src/components/TopNavigation.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from './CategoryNav.tsx';
import ThemeToggle from './ThemeToggle';
// import LanguageSelector from './LanguageSelector'; // You might need to adjust this component or integrate its logic here
import { Search, X } from 'lucide-react';

const TopNavigation = ({ activeCategory, setActiveCategory }) => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const handleSearchClick = () => {
        setShowSearchInput(true);
        setTimeout(() => {
            document.getElementById('search-blog-input')?.focus();
        }, 10);
    };

    const handleCloseSearch = () => {
        setShowSearchInput(false);
        setSearchQuery('');
    };

    // Placeholder for language change handler
    const handleChangeLanguage = (lang) => {
        console.log(`Changing language to: ${lang}`);
        // Here you would call your i18n changeLanguage function
        // e.g., i18n.changeLanguage(lang);
    };

    return (
        <nav className="sticky top-0 z-50">
            {/* Top Bar */}
            <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border-b border-border-light dark:border-border-dark py-2 px-4 md:px-8 text-sm text-text-muted dark:text-text-light flex justify-between items-center transition-colors duration-300">
                {/* Left Section: Language, Date, Time - Reduced gap */}
                <div className="flex items-center space-x-2">
                    {/* Language Edition (styled as per screenshot) */}
                    <div className="relative group cursor-pointer py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <span className="text-text-dark dark:text-text-light text-sm flex items-center">
                            English Edition
                            <span className="material-icons text-base ml-1">arrow_drop_down</span>
                        </span>
                        {/* Placeholder for Language Dropdown content */}
                        <div className="absolute top-full left-0 pt-1 w-32 bg-light-bg-secondary dark:bg-dark-bg-secondary shadow-lg rounded-md hidden group-hover:block transition-all duration-200 z-30">
                            {/* CHANGED TO BUTTONS: Address jsx-a11y/anchor-is-valid */}
                            <button
                                type="button" // Important for buttons not to submit forms
                                onClick={() => handleChangeLanguage('hi')} // Example handler
                                className="block w-full text-left px-3 py-2 text-text-dark dark:text-text-light hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Hindi
                            </button>
                            <button
                                type="button"
                                onClick={() => handleChangeLanguage('es')} // Example handler
                                className="block w-full text-left px-3 py-2 text-text-dark dark:text-text-light hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Spanish
                            </button>



                            <button
                                type="button"
                                onClick={() => handleChangeLanguage('fr')} // Example handler
                                className="block w-full text-left px-3 py-2 text-text-dark dark:text-text-light hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                French
                            </button>



                        </div>
                    </div>
                    <span className="border-l border-border-light dark:border-border-dark h-4 mx-1"></span>
                    <span className="hidden sm:inline-block">{formatDate(currentDateTime)},</span>
                    <span className="hidden sm:inline-block">{formatTime(currentDateTime)} IST</span>
                </div>

                {/* Right Section: Social/Utility Icons - Reduced gap */}
                <div className="flex items-center space-x-3">
                    <a href="https://example.com/notifications" target="_blank" rel="noopener noreferrer" className="material-icons text-xl text-text-muted dark:text-text-light hover:text-accent dark:hover:text-accent-light transition-colors duration-200" aria-label="Notifications">notifications_none</a>
                    <a href="https://example.com/profile" target="_blank" rel="noopener noreferrer" className="material-icons text-xl text-text-muted dark:text-text-light hover:text-accent dark:hover:text-accent-light transition-colors duration-200" aria-label="Profile">person_outline</a>
                    <a href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer" className="text-xl text-text-muted dark:text-text-light hover:text-accent dark:hover:text-accent-light transition-colors duration-200" aria-label="Twitter">
                        <span className="font-bold">X</span>
                    </a>
                    <a href="https://youtube.com/yourchannel" target="_blank" rel="noopener noreferrer" className="material-icons text-xl text-text-muted dark:text-text-light hover:text-accent dark:hover:text-accent-light transition-colors duration-200" aria-label="YouTube">play_circle_outline</a>
                </div>
            </div>

            {/* Main Navigation Bar */}
            <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border-b border-border-light dark:border-border-dark py-4 px-4 md:px-8 flex justify-between items-center transition-colors duration-300">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-3xl font-extrabold text-text-dark dark:text-text-light hover:text-accent dark:hover:text-accent-light transition-colors duration-200 flex-shrink-0"
                >
                    MyBlog
                </Link>

                {/* Category Scroller (your current NavBar.js) */}
                <div className="flex-grow flex justify-center mx-4 overflow-hidden">
                    <CategoryNav activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
                </div>

                {/* Right Section: Search & Theme Toggle - Reduced gap */}
                <div className="flex items-center space-x-3 flex-shrink-0">
                    {/* Search Bar / Icon */}
                    {showSearchInput ? (
                        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1.5 transition-all duration-300 w-full max-w-xs">
                            <input
                                id="search-blog-input"
                                type="text"
                                placeholder="Search by keyword or tag..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent focus:outline-none text-text-dark dark:text-text-light placeholder-text-muted w-full"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        // TODO: Trigger search logic here
                                        console.log("Search query:", searchQuery);
                                    }
                                }}
                            />
                            <button onClick={handleCloseSearch} className="ml-2 text-text-muted hover:text-accent dark:hover:text-accent-light transition-colors duration-200" aria-label="Close search">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <button onClick={handleSearchClick} className="text-text-muted dark:text-text-light hover:text-accent dark:hover:text-accent-light transition-colors duration-200" aria-label="Open search">
                            <Search className="w-6 h-6" />
                        </button>
                    )}

                    {/* Theme Toggle */}
                    <ThemeToggle />
                    {/* Mobile Menu Icon (optional for smaller screens, if categories are hidden) */}
                    <button className="md:hidden material-icons text-2xl text-text-muted dark:text-text-light hover:text-accent dark:hover:text-accent-light transition-colors duration-200" aria-label="Menu">
                        menu
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default TopNavigation;