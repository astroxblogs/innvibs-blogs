// client/src/components/CategoryScroller.js
// (This was previously NavBar.js)

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
    { label: 'Home', value: 'all' },
    { label: 'Fashion', value: 'fashion' },
    { label: 'Beauty', value: 'beauty' },
    { label: 'Health', value: 'health' },
    { label: 'Yoga Spirituality', value: 'yoga-spirituality' },
    { label: 'Pregnancy', value: 'pregnancy' },
    { label: 'Relationship', value: 'relationship' },
    { label: 'Recipes', value: 'recipes' },
    { label: 'Home n Garden', value: 'home-garden' },
    { label: 'Art Culture', value: 'art-culture' },
    { label: 'Women', value: 'women' },
];

const VISIBLE_COUNT = 5;

const CategoryScroller = ({ activeCategory, setActiveCategory }) => {
    const [startIdx, setStartIdx] = useState(0);

    const canScrollLeft = startIdx > 0;
    const canScrollRight = startIdx + VISIBLE_COUNT < categories.length;

    const handleScrollLeft = () => {
        if (canScrollLeft) setStartIdx(startIdx - 1);
    };

    const handleScrollRight = () => {
        if (canScrollRight) setStartIdx(startIdx + 1);
    };

    const visibleCategories = categories.slice(startIdx, startIdx + VISIBLE_COUNT);

    return (
        <div
            // This component itself no longer needs a full background or sticky position
            // as it will be nested inside the new TopNavigation.
            // We only keep border-b for internal separation within the TopNavigation.
            className="
                w-full 
                transition-colors duration-300 py-3
            "
        >
            <div className="max-w-screen-xl mx-auto flex justify-center items-center px-4 relative">
                {/* Left Arrow Button */}
                <button
                    onClick={handleScrollLeft}
                    disabled={!canScrollLeft}
                    className={`
                        p-2 mr-2 rounded transition-colors duration-200
                        ${canScrollLeft
                            ? 'text-text-muted dark:text-text-light hover:text-accent dark:hover:text-accent-light'
                            : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        }
                    `}
                    aria-label="Scroll left"
                >
                    <ChevronLeft />
                </button>

                {/* Animated Categories Container */}
                <div
                    className="flex space-x-4 transition-transform duration-300 overflow-hidden" // Added overflow-hidden to handle category display
                    style={{
                        minWidth: 0,
                        width: 'fit-content',
                        transform: `translateX(0)`,
                    }}
                >
                    {visibleCategories.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setActiveCategory && setActiveCategory(cat.value)}
                            className={`
                                flex-shrink-0 text-sm px-3 py-1 rounded-md transition font-medium
                                duration-200 ease-in-out
                                ${activeCategory === cat.value
                                    ? 'bg-accent text-text-light dark:bg-accent-dark'
                                    : 'text-text-muted hover:text-accent dark:text-text-light dark:hover:text-accent-light'
                                }
                            `}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Right Arrow Button */}
                <button
                    onClick={handleScrollRight}
                    disabled={!canScrollRight}
                    className={`
                        p-2 ml-2 rounded transition-colors duration-200
                        ${canScrollRight
                            ? 'text-text-muted dark:text-text-light hover:text-accent dark:hover:text-accent-light'
                            : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        }
                    `}
                    aria-label="Scroll right"
                >
                    <ChevronRight />
                </button>
            </div>
        </div>
    );
};

export default CategoryScroller; // <--- IMPORTANT: Changed export name