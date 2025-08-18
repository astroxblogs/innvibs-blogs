import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';
import {
    Search, X, ChevronLeft, ChevronRight, Menu, Facebook, Twitter, Instagram, Linkedin
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

// --- REMOVED THE HARDCODED CATEGORIES ARRAY ---
// const categories = [
//     { labelKey: "category.all", value: "all" },
//     { labelKey: "category.technology", value: "Technology" },
//     ...
// ];

const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "https://facebook.com/astroxhub", className: "text-blue-600 hover:text-blue-700 dark:hover:text-blue-500" },
    { name: "Twitter", icon: Twitter, url: "https://twitter.com/astroxhub", className: "text-blue-400 hover:text-blue-500 dark:hover:text-blue-300" },
    { name: "Instagram", icon: Instagram, url: "https://instagram.com/astroxhub", className: "text-pink-500 hover:text-pink-600 dark:hover:text-pink-400" },
    { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com/company/astroxhub", className: "text-blue-700 hover:text-blue-800 dark:hover:text-blue-600" },
];

// --- NEW PROPS ADDED: `categories` ---
const TopNavigation = ({ activeCategory, onCategoryChange, setSearchQuery, onLogoClick, categories }) => {
    const { t, i18n } = useTranslation(); // <-- ADDED `i18n` to get the current language

    const [showSearchInput, setShowSearchInput] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const scrollRef = useRef(null);
    const itemRefs = useRef([]);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const checkArrows = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        const isScrollable = el.scrollWidth > el.clientWidth;
        setShowLeftArrow(isScrollable && el.scrollLeft > 5);
        setShowRightArrow(isScrollable && (el.scrollWidth - el.clientWidth - el.scrollLeft > 5));
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.scrollLeft = 0;
            checkArrows();

            let resizeTimer;
            const handleResize = () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(checkArrows, 100);
            };
            el.addEventListener("scroll", checkArrows);
            window.addEventListener("resize", handleResize);
            return () => {
                el.removeEventListener("scroll", checkArrows);
                window.removeEventListener("resize", handleResize);
            };
        }
    }, [checkArrows,categories]);

    const handleNext = () => {
        scrollRef.current?.scrollBy({ left: scrollRef.current.clientWidth * 0.5, behavior: "smooth" });
    };

    const handlePrev = () => {
        scrollRef.current?.scrollBy({ left: -scrollRef.current.clientWidth * 0.5, behavior: "smooth" });
    };

    // --- UPDATED CATEGORY CLICK HANDLER TO USE DYNAMIC DATA ---
    const handleCategoryClick = (categoryValue) => {
        onCategoryChange(categoryValue.trim()); 
        setIsSidebarOpen(false);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        setSearchQuery(inputValue);
        setIsSidebarOpen(false);
    };

    const handleCloseSearch = () => {
        setShowSearchInput(false);
        setInputValue('');
        setSearchQuery('');
    };

    const handleSearchClick = () => setShowSearchInput(true);
    const handleLogoLinkClick = () => {
        onLogoClick?.();
        setIsSidebarOpen(false);
    };

    const sidebarVariants = {
        hidden: { x: "-100%" },
        visible: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
        exit: { x: "-100%", transition: { duration: 0.3 } }
    };

    // --- CREATE A NEW DYNAMIC CATEGORIES LIST FOR RENDERING ---
    const dynamicCategories = [
        { name_en: "All", name_hi: "सभी", value: "all" },
        ...categories.map(cat => ({
            name_en: cat.name_en,
            name_hi: cat.name_hi,
            value: cat.name_en
        }))
    ];

    const getCategoryName = (category) => {
        return i18n.language === 'hi' ? category.name_hi : category.name_en;
    };


    return (
        <nav className="sticky top-0 z-50 bg-light-bg-secondary dark:bg-dark-bg-secondary shadow-sm">
            <div className="py-3 px-4 md:px-8 flex justify-between items-center">
                {/* Left - Menu & Logo */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label={t('navigation.open_menu')}
                    >
                        <Menu size={24} />
                    </button>
                    <Link
                        to="/"
                        onClick={handleLogoLinkClick}
                        className="flex items-center gap-2 flex-shrink-0 max-w-[120px] sm:max-w-[140px] md:max-w-none"
                    >
                        <img
                            src="/lm1.png"
                            alt="Logo Light"
                            className="h-8 sm:h-10 w-auto object-contain block dark:hidden"
                        />
                        <img
                            src="/tp2..png"
                            alt="Logo Dark"
                            className="h-8 sm:h-10 w-auto object-contain hidden dark:block"
                        />
                    </Link>
                </div>

                {/* Center - Scrollable Categories */}
                <div className="hidden md:flex flex-grow justify-center items-center">
                    <div className="relative flex items-center w-full max-w-[580px] mx-auto">
                        <AnimatePresence>
                            {showLeftArrow && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="absolute left-0 z-20 bg-light-bg-secondary dark:bg-dark-bg-secondary pr-4 rounded-r-full"
                                >
                                    <button onClick={handlePrev} className="p-1.5 rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-gray-700">
                                        <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div ref={scrollRef} className="flex items-center space-x-4 whitespace-nowrap overflow-x-auto scroll-smooth no-scrollbar px-10">
                            {/* --- MAP OVER THE DYNAMIC CATEGORIES LIST --- */}
                            {dynamicCategories.map((cat, idx) => (
                                <button
                                    key={cat.value}
                                    ref={(el) => (itemRefs.current[idx] = el)}
                                    onClick={() => handleCategoryClick(cat.value)}
                                    className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${activeCategory === cat.value
                                        ? "bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900"
                                        : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                        }`}
                                >
                                    {/* Use the getCategoryName function to show the correct language */}
                                    {getCategoryName(cat)}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence>
                            {showRightArrow && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="absolute right-0 z-20 bg-light-bg-secondary dark:bg-dark-bg-secondary pl-4 rounded-l-full"
                                >
                                    <button onClick={handleNext} className="p-1.5 rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-gray-700">
                                        <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right - Controls */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    {showSearchInput ? (
                        <form
                            onSubmit={handleSearchSubmit}
                            className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-1 w-full max-w-xs"
                        >
                            <input
                                type="text"
                                placeholder={t('Search...')}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="bg-transparent text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 border-none w-full"
                            />
                            <button
                                type="button"
                                onClick={handleCloseSearch}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </form>
                    ) : (
                        <button
                            onClick={handleSearchClick}
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    )}

                    <LanguageSelector />
                    <ThemeToggle />
                </div>
            </div>

            {/* Sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        />
                        <motion.div
                            className="fixed inset-y-0 left-0 z-50 bg-light-bg-secondary dark:bg-dark-bg-secondary w-full md:w-[320px] overflow-y-auto"
                            variants={sidebarVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="w-full flex justify-between items-center p-4 pb-0">
                                <Link to="/" onClick={handleLogoLinkClick}>
                                    <img
                                        src="/lm1.png"
                                        alt="Logo Light"
                                        className="h-10 w-auto object-contain block dark:hidden"
                                    />
                                    <img
                                        src="/tp2..png"
                                        alt="Logo Dark"
                                        className="h-10 w-auto object-contain hidden dark:block"
                                    />
                                </Link>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-4" />
                            <div className="px-4 space-y-4">
                                <div>
                                    <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">
                                        {t('footer.categories_title')}
                                    </h3>
                                    <ul className="space-y-2">
                                        {/* --- MAP OVER THE DYNAMIC CATEGORIES LIST FOR THE SIDEBAR --- */}
                                        {dynamicCategories.map((cat) => (
                                            <li key={cat.value}>
                                                <button
                                                    onClick={() => handleCategoryClick(cat.value)}
                                                    className={`w-full py-1.5 text-lg font-medium rounded-md ${activeCategory === cat.value
                                                        ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
                                                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                                        }`}
                                                >
                                                    {getCategoryName(cat)}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-600 dark:text-white mb-2">{t('Connect With Us')}</h3>
                                    <div className="flex gap-3 mb-4">
                                        {socialLinks.map(({ name, icon: Icon, url, className }) => (
                                            <a
                                                key={name}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:scale-110 transition-all ${className}`}
                                            >
                                                <Icon size={18} />
                                            </a>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-white">
                                        {t('innvibs Blogs', { year: new Date().getFullYear(), appName: 'Innvibs Media Group' })}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default TopNavigation;