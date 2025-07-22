import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

// UPDATED: Define categories with a 'labelKey' for translation
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
];

const MAX_VISIBLE_CATEGORIES = 5;

const TopNavigation = ({ activeCategory, onCategoryChange, setSearchQuery }) => {
    const { t } = useTranslation();

    const [showSearchInput, setShowSearchInput] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [startIndex, setStartIndex] = useState(0);

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
                    <img src="/logo.png" alt={t('application_name')} className="h-8 w-8" />
                    <span>{t('application_name')}</span> {/* Translated application name */}
                </Link>

                {/* Category Navigation - NOW ALL CATEGORIES ARE TRANSLATED */}
                <div className="flex-grow flex justify-center items-center">
                    <div className="flex items-center">
                        <AnimatePresence>
                            {showLeftArrow && (
                                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                                    <button onClick={handlePrev} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-2" aria-label={t('navigation.prev_categories')}>
                                        <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div className="flex items-center space-x-3 whitespace-nowrap">
                            {categories.slice(startIndex, startIndex + MAX_VISIBLE_CATEGORIES).map((cat) => (
                                <button key={cat.value} onClick={() => handleCategoryClick(cat.value)} className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${activeCategory === cat.value ? "bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900" : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"}`}>
                                    {t(cat.labelKey)} {/* Changed to t(cat.labelKey) for all categories */}
                                </button>
                            ))}
                        </div>
                        <AnimatePresence>
                            {showRightArrow && (
                                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                                    <button onClick={handleNext} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ml-2" aria-label={t('navigation.next_categories')}>
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
        </nav>
    );
};

export default TopNavigation;