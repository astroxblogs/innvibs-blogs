import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

// Import Menu icon for the mobile hamburger button
import { Search, X, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
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

// MAX_VISIBLE_CATEGORIES is now only relevant for the desktop category slider (which will be hidden on mobile)
// For the mobile menu, all categories will be shown vertically.
const MAX_VISIBLE_CATEGORIES = 4;

// Add onLogoClick to the destructured props
const TopNavigation = ({ activeCategory, onCategoryChange, setSearchQuery, onLogoClick }) => {
    const { t } = useTranslation();

    const [showSearchInput, setShowSearchInput] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [startIndex, setStartIndex] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu visibility

    const handleNext = () => setStartIndex(prev => Math.min(prev + 1, categories.length - MAX_VISIBLE_CATEGORIES));
    const handlePrev = () => setStartIndex(prev => Math.max(prev - 1, 0));

    const handleCategoryClick = (categoryValue) => {
        onCategoryChange(categoryValue);
        setIsMobileMenuOpen(false); // Close menu after selection
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        setSearchQuery(inputValue);
        setIsMobileMenuOpen(false);
    };

    const handleCloseSearch = () => {
        setShowSearchInput(false);
        setInputValue('');
        setSearchQuery('');
    };

    const handleSearchClick = () => setShowSearchInput(true);

    // Call onLogoClick when the logo Link is clicked
    const handleLogoLinkClick = () => {
        if (onLogoClick) {
            onLogoClick();
        }
    };

    const showLeftArrow = categories.length > MAX_VISIBLE_CATEGORIES && startIndex > 0;
    const showRightArrow = categories.length > MAX_VISIBLE_CATEGORIES && startIndex < categories.length - MAX_VISIBLE_CATEGORIES;

    // Animation variants for the mobile menu
    const menuVariants = {
        hidden: { x: "100%" }, // Starts off-screen to the right
        visible: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }, // Slides in
        exit: { x: "100%", transition: { duration: 0.3 } } // Slides out
    };

    return (
        <nav className="sticky top-0 z-50 bg-light-bg-secondary dark:bg-dark-bg-secondary shadow-sm">
            {/* Main Header Row: Always visible */}
            <div className="py-3 px-4 md:px-8 flex justify-between items-center">
                {/* Logo Section */}
                {/* Add onClick handler to the Link component */}
                <Link to="/" onClick={handleLogoLinkClick} className="flex items-center gap-2 text-2xl font-extrabold text-text-dark dark:text-white flex-shrink-0">
                    <img src="/logo.png" alt={t('application_name')} className="h-8 w-8" />
                    <span>{t('application_name')}</span>
                </Link>

                {/* Desktop Category Navigation (Hidden on mobile) */}
                <div className="hidden md:flex flex-grow justify-center items-center">
                    <div className="flex items-center">
                        <AnimatePresence>
                            {showLeftArrow && (
                                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                                    <button onClick={handlePrev} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-2 flex-shrink-0" aria-label={t('navigation.prev_categories')}>
                                        <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div className="flex items-center space-x-3 whitespace-nowrap">
                            {categories.slice(startIndex, startIndex + MAX_VISIBLE_CATEGORIES).map((cat) => (
                                <button key={cat.value} onClick={() => onCategoryChange(cat.value)} className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${activeCategory === cat.value ? "bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900" : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"}`}>
                                    {t(cat.labelKey)}
                                </button>
                            ))}
                        </div>
                        <AnimatePresence>
                            {showRightArrow && (
                                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                                    <button onClick={handleNext} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ml-2 flex-shrink-0" aria-label={t('navigation.next_categories')}>
                                        <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Side Controls for Desktop */}
                <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
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

                {/* Mobile-specific Controls (Visible on mobile, hidden on desktop) */}
                <div className="flex md:hidden items-center space-x-3">
                    {showSearchInput ? (
                        <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1.5 w-full max-w-xs">
                            <input
                                id="search-blog-input-mobile"
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

                    {/* Hamburger Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label={t('navigation.open_menu')}
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* Mobile Off-Canvas Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-light-bg-secondary dark:bg-dark-bg-secondary flex flex-col items-end"
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Close button */}
                        <div className="w-full flex justify-end p-4">
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label={t('navigation.close_menu')}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Menu Content */}
                        <div className="w-full flex flex-col items-center p-4 space-y-6">
                            {/* Categories */}
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {t('footer.categories_title')}
                            </h3>
                            <ul className="w-full text-center space-y-3">
                                {categories.map((cat) => (
                                    <li key={cat.value}>
                                        <button
                                            onClick={() => handleCategoryClick(cat.value)}
                                            className={`w-full py-2 text-lg font-medium rounded-md transition-colors duration-200 ${activeCategory === cat.value ? "bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900" : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"}`}
                                        >
                                            {t(cat.labelKey)}
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            {/* Language Selector & Theme Toggle */}
                            <div className="flex items-center space-x-4 mt-6">
                                <LanguageSelector />
                                <ThemeToggle />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default TopNavigation;