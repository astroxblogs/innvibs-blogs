import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';
import {
    Search, X, ChevronLeft, ChevronRight, Menu, Facebook, Twitter, Instagram, Linkedin
} from 'lucide-react';
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

const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "https://facebook.com/astroxhub", className: "text-blue-600 hover:text-blue-700 dark:hover:text-blue-500" },
    { name: "Twitter", icon: Twitter, url: "https://twitter.com/astroxhub", className: "text-blue-400 hover:text-blue-500 dark:hover:text-blue-300" },
    { name: "Instagram", icon: Instagram, url: "https://instagram.com/astroxhub", className: "text-pink-500 hover:text-pink-600 dark:hover:text-pink-400" },
    { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com/company/astroxhub", className: "text-blue-700 hover:text-blue-800 dark:hover:text-blue-600" },
];

const TopNavigation = ({ activeCategory, onCategoryChange, setSearchQuery, onLogoClick }) => {
    const { t } = useTranslation();

    const [showSearchInput, setShowSearchInput] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
            el.scrollLeft = 80;
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

    const handleNext = () => {
        scrollRef.current?.scrollBy({ left: scrollRef.current.clientWidth * 0.5, behavior: "smooth" });
    };

    const handlePrev = () => {
        scrollRef.current?.scrollBy({ left: -scrollRef.current.clientWidth * 0.5, behavior: "smooth" });
    };

    const handleCategoryClick = (categoryValue) => {
        onCategoryChange(categoryValue);
        setIsSidebarOpen(false);
        const idx = categories.findIndex((c) => c.value === categoryValue);
        const el = itemRefs.current[idx];
        const scrollEl = scrollRef.current;
        if (el && scrollEl) {
            const scrollAmount = el.offsetLeft - scrollEl.offsetWidth / 2 + el.offsetWidth / 2;
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
        onLogoClick?.();
        setIsSidebarOpen(false);
    };

    const sidebarVariants = {
        hidden: { x: "-100%" },
        visible: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
        exit: { x: "-100%", transition: { duration: 0.3 } }
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
                            src="/header.png"
                            alt="Logo Light"
                            className="h-8 sm:h-10 w-auto object-contain block dark:hidden"
                        />
                        <img
                            src="/Top1.png"
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
                            {categories.map((cat, idx) => (
                                <button
                                    key={cat.value}
                                    ref={(el) => (itemRefs.current[idx] = el)}
                                    onClick={() => handleCategoryClick(cat.value)}
                                    className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${activeCategory === cat.value
                                            ? "bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900"
                                            : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                        }`}
                                >
                                    {t(cat.labelKey)}
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
                        <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1.5 max-w-xs">
                            <input
                                type="text"
                                placeholder={t('search.placeholder')}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="bg-transparent focus:outline-none text-text-dark dark:text-text-light w-full"
                            />
                            <button type="button" onClick={handleCloseSearch} className="ml-2 text-gray-500 hover:text-red-500">
                                <X className="w-5 h-5" />
                            </button>
                        </form>
                    ) : (
                        <button onClick={handleSearchClick} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                            <Search className="w-6 h-6" />
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
                                        src="/header.png"
                                        alt="Logo Light"
                                        className="h-10 w-auto object-contain block dark:hidden"
                                    />
                                    <img
                                        src="/Top1.png"
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
                                        {categories.map((cat) => (
                                            <li key={cat.value}>
                                                <button
                                                    onClick={() => handleCategoryClick(cat.value)}
                                                    className={`w-full py-1.5 text-lg font-medium rounded-md ${activeCategory === cat.value
                                                            ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
                                                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                                        }`}
                                                >
                                                    {t(cat.labelKey)}
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
                                                <Icon size={25} />
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
