import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

// Import icons: Menu for hamburger, X for close, and social media icons
import { Search, X, ChevronLeft, ChevronRight, Menu, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

const categories = [
    { labelKey: "category.all", value: "all" },
    { labelKey: "category.technology", value: "Technology" },
    { labelKey: "category.fashion", value: "Fashion" },
    { labelKey: "category.health_wellness", value: "Health & Wellness" },
    { labelKey: "category.travel", value: "Travel" },
    { labelKey: "category.food_cooking", value: "Food & Cooking" },
    { labelKey: "category.sports", value: "Sports" },
    { labelKey: "category.business_finance", value: "Business & Finance" },
    { labelKey: "category.lifestyle", value: "Lifestyle" },
    { labelKey: "category.trends", value: "Trends" },
    { labelKey: "category.relationship", value: "Relationship" },
];

const essentialLinks = [
    { labelKey: "navigation.home", to: "/" },
    { labelKey: "navigation.blog", to: "/blog-list" }, // Assuming you have a general blog list page
    { labelKey: "navigation.admin", to: "/admin" },
];

const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "https://facebook.com/astroxhub", className: "text-blue-600 hover:text-blue-700 dark:hover:text-blue-500" },
    { name: "Twitter", icon: Twitter, url: "https://twitter.com/astroxhub", className: "text-blue-400 hover:text-blue-500 dark:hover:text-blue-300" },
    { name: "Instagram", icon: Instagram, url: "https://instagram.com/astroxhub", className: "text-pink-500 hover:text-pink-600 dark:hover:text-pink-400" },
    { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com/company/astroxhub", className: "text-blue-700 hover:text-blue-800 dark:hover:text-blue-600" },
];

const MAX_VISIBLE_CATEGORIES = 5;

const TopNavigation = ({ activeCategory, onCategoryChange, setSearchQuery, onLogoClick }) => {
    const { t } = useTranslation();

    const [showSearchInput, setShowSearchInput] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [startIndex, setStartIndex] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Refs for desktop category horizontal scrolling
    const scrollRef = useRef(null);
    const itemRefs = useRef([]);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

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
            const initialScrollAmount = 80;
            el.scrollLeft = initialScrollAmount;
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
    }, [checkArrows]);

    const SCROLL_AMOUNT_FACTOR = 0.5;

    const handleNext = () => {
        const el = scrollRef.current;
        if (el) {
            const scrollAmount = el.clientWidth * SCROLL_AMOUNT_FACTOR;
            el.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };
    const handlePrev = () => {
        const el = scrollRef.current;
        if (el) {
            const scrollAmount = el.clientWidth * SCROLL_AMOUNT_FACTOR;
            el.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
    };

    const handleCategoryClick = (categoryValue) => {
        onCategoryChange(categoryValue);
        setIsSidebarOpen(false);
        const categoryIndex = categories.findIndex((c) => c.value === categoryValue);
        const itemEl = itemRefs.current[categoryIndex];
        const scrollEl = scrollRef.current;
        if (itemEl && scrollEl) {
            const scrollAmount = itemEl.offsetLeft - (scrollEl.offsetWidth / 2) + (itemEl.offsetWidth / 2);
            scrollEl.scrollTo({ left: scrollAmount, behavior: "smooth" });
        }
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
        if (onLogoClick) {
            onLogoClick();
        }
        setIsSidebarOpen(false);
    };

    const sidebarVariants = {
        hidden: { x: "-100%" },
        visible: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
        exit: { x: "-100%", transition: { duration: 0.3 } }
    };

    const staticVisibleCategories = categories.slice(0, MAX_VISIBLE_CATEGORIES);
    const hasMoreCategoriesThanVisible = categories.length > MAX_VISIBLE_CATEGORIES;

    return (
        <nav className="sticky top-0 z-50 bg-light-bg-secondary dark:bg-dark-bg-secondary shadow-sm">
            {/* Main Header Row: Always visible */}
            <div className="py-3 px-4 md:px-8 flex justify-between items-center">
                {/* Left Side: Hamburger Menu & Logo */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label={t('navigation.open_menu')}
                    >
                        <Menu size={24} />
                    </button>

                    <Link
                        to="/"
                        onClick={handleLogoLinkClick}
                        // Adjusted max-w for smaller screens to prevent overlap
                        className="flex items-center gap-2 flex-shrink-0 max-w-[120px] sm:max-w-[140px] md:max-w-none"
                    >
                        <img
                            src="/1.png"
                            // Adjusted height for better fit on small screens
                            className="h-8 w-auto sm:h-10 object-contain"
                        />
                    </Link>
                </div>

                {/* Desktop Category Navigation (Horizontal scrolling - Visible only on desktop) */}
                <div className="hidden md:flex flex-grow justify-center items-center">
                    <div className="relative flex items-center w-full max-w-[580px] mx-auto">
                        {/* Left Arrow */}
                        <AnimatePresence>
                            {showLeftArrow && (
                                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                                    className="absolute left-0 z-20 bg-light-bg-secondary dark:bg-dark-bg-secondary pr-4 rounded-r-full">
                                    <button onClick={handlePrev} className="p-1.5 rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 flex-shrink-0" aria-label={t('navigation.prev_categories')}>
                                        <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Scrollable Category List */}
                        <div
                            ref={scrollRef}
                            className="flex items-center space-x-4 whitespace-nowrap overflow-x-auto scroll-smooth no-scrollbar px-10"
                        >
                            {categories.map((cat, idx) => (
                                <button
                                    key={cat.value}
                                    ref={(el) => (itemRefs.current[idx] = el)}
                                    onClick={() => handleCategoryClick(cat.value)}
                                    className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium text-center transition-colors duration-200 ${activeCategory === cat.value ? "bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900" : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"}`}
                                >
                                    {t(cat.labelKey)}
                                </button>
                            ))}
                        </div>

                        {/* Right Arrow */}
                        <AnimatePresence>
                            {showRightArrow && (
                                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                                    className="absolute right-0 z-20 bg-light-bg-secondary dark:bg-dark-bg-secondary pl-4 rounded-l-full">
                                    <button onClick={handleNext} className="p-1.5 rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 flex-shrink-0" aria-label={t('navigation.next_categories')}>
                                        <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Side Controls (Search, Language, Theme) - Always visible */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    {showSearchInput ? (
                        <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1.5 w-full max-w-xs">
                            <input
                                id="search-blog-input"
                                type="text"
                                placeholder={t('search.placeholder')}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="bg-transparent focus:outline-none text-text-dark dark:text-text-light w-full"
                            />
                            <button onClick={handleCloseSearch} type="button" className="ml-2 text-gray-500 hover:text-red-500" aria-label={t('search.close')}>
                                <X className="w-5 h-5" />
                            </button>
                        </form>
                    ) : (
                        <button onClick={handleSearchClick} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" aria-label={t('search.open')}>
                            <Search className="w-6 h-6" />
                        </button>
                    )}
                    <LanguageSelector />
                    <ThemeToggle />
                </div>
            </div>

            {/* Off-Canvas Sidebar Overlay and Menu (SLIDES FROM LEFT) */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        />

                        {/* Sidebar Menu */}
                        <motion.div
                            className="fixed inset-y-0 left-0 z-50 bg-light-bg-secondary dark:bg-dark-bg-secondary flex flex-col items-start
                                       w-full md:w-[320px] shadow-lg overflow-y-auto"
                            variants={sidebarVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {/* Close button and Logo at top-right within the sidebar header */}
                            <div className="w-full flex justify-between items-center p-4 pb-0">
                                <Link to="/" onClick={handleLogoLinkClick} className="flex items-center gap-2 flex-shrink-0">
                                    <img src="/1.png"  className="h-10 w-auto object-contain" />
                                </Link>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label={t('navigation.close_menu')}
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-4"></div>

                            {/* Sidebar Content Sections */}
                            <div className="w-full flex flex-col items-start px-4 space-y-4">

                                

                                {/* Categories Section (Always visible in sidebar, for both mobile & desktop) */}
                                <div className="w-full mt-4">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                                        {t('footer.categories_title')}
                                    </h3>
                                    <ul className="w-full text-left space-y-2">
                                        {categories.map((cat) => (
                                            <li key={cat.value}>
                                                <button
                                                    onClick={() => handleCategoryClick(cat.value)}
                                                    className={`w-full text-left py-1.5 text-lg font-medium rounded-md transition-colors duration-200 ${activeCategory === cat.value ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white" : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"}`}
                                                >
                                                    {t(cat.labelKey)}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Social Media Links Section */}
                                <div className="w-full mt-4">
                                    <h3 className="text-sm font-semibold text-gray-600 dark:text-white mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                                        {t('Connect With Us')}
                                    </h3>
                                    <div className="flex gap-3 w-full justify-start mb-4">
                                        {socialLinks.map((social) => {
                                            const Icon = social.icon;
                                            return (
                                                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name} className={`p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200 ${social.className}`}>
                                                    <Icon size={25} />
                                                </a>
                                            );
                                        })}
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