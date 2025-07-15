import React, { useRef } from 'react';
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

const NavBar = ({ activeCategory, setActiveCategory }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        const container = scrollRef.current;
        if (container) {
            const scrollAmount = 150;
            container.scrollBy({ left: direction === 'right' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
        }
    };

    // Split categories into first 5 and the rest
    const firstFive = categories.slice(0, 5);
    const rest = categories.slice(5);

    return (
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
            <div className="max-w-screen-xl mx-auto flex items-center px-4 relative overflow-hidden">
                {/* First 5 categories (always visible) */}
                <div className="flex space-x-4 py-3">
                    {firstFive.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setActiveCategory && setActiveCategory(cat.value)}
                            className={`flex-shrink-0 text-sm px-3 py-1 rounded-md transition font-medium 
                                ${activeCategory === cat.value
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
                {/* Left Scroll Button for rest */}
                <button onClick={() => scroll('left')} className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 z-10">
                    <ChevronLeft />
                </button>
                {/* Scrollable rest of categories */}
                <div
                    ref={scrollRef}
                    className="flex-1 flex space-x-4 overflow-x-auto scrollbar-hide py-3 ml-2"
                    style={{ minWidth: 0 }}
                >
                    {rest.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setActiveCategory && setActiveCategory(cat.value)}
                            className={`flex-shrink-0 text-sm px-3 py-1 rounded-md transition font-medium 
                                ${activeCategory === cat.value
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
                {/* Right Scroll Button for rest */}
                <button onClick={() => scroll('right')} className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 z-10">
                    <ChevronRight />
                </button>
            </div>
        </div>
    );
};

export default NavBar;
