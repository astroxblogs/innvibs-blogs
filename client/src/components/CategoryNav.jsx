import React, { useRef, useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  { label: "Trends", value: "Trends" }, // <-- ADDED
  { label: "Relationship", value: "Relationship" }, // <-- ADDED
];


export default function CategoryNav({ activeCategory, onCategoryChange }) {
  const scrollRef = useRef(null);
  const itemRefs = useRef([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const isScrollable = el.scrollWidth > el.clientWidth;
    // Added parentheses to satisfy the 'no-mixed-operators' rule
    setShowLeftArrow(isScrollable && (el.scrollLeft > 1));
    setShowRightArrow(
      isScrollable && (el.scrollWidth - el.clientWidth - el.scrollLeft > 1)
    );
  }, [scrollRef]); // 1. Added scrollRef as a dependency

  useEffect(() => {
    const el = scrollRef.current;
    checkArrows();
    el?.addEventListener("scroll", checkArrows);
    window.addEventListener("resize", checkArrows);
    return () => {
      el?.removeEventListener("scroll", checkArrows);
      window.removeEventListener("resize", checkArrows);
    };
  }, [checkArrows, scrollRef]); // 2. Added scrollRef as a dependency

  const handleCategoryClick = (categoryValue) => {
    onCategoryChange(categoryValue);

    const categoryIndex = categories.findIndex(
      (c) => c.value === categoryValue
    );
    const itemEl = itemRefs.current[categoryIndex];
    const scrollEl = scrollRef.current;

    if (itemEl && scrollEl) {
      const scrollAmount = itemEl.offsetLeft - scrollEl.offsetWidth / 2 + itemEl.offsetWidth / 2;
      scrollEl.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleArrowScroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full bg-background py-2 border-b dark:border-gray-800">
      <div className="relative mx-auto flex max-w-2xl items-center">
        <AnimatePresence>
          {showLeftArrow && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -left-4 sm:-left-12 top-0 bottom-0 flex items-center z-10"
            >
              <button
                onClick={() => handleArrowScroll("left")}
                className="rounded-full bg-white p-1.5 shadow-md border border-gray-200 hover:bg-gray-100 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-200" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          ref={scrollRef}
          className="flex items-center space-x-3 overflow-x-auto whitespace-nowrap scroll-smooth no-scrollbar px-2"
        >
          {categories.map((cat, idx) => (
            <button
              key={cat.value}
              ref={(el) => (itemRefs.current[idx] = el)}
              onClick={() => handleCategoryClick(cat.value)}
              className={`
                flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                ${activeCategory === cat.value
                  ? "bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {showRightArrow && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -right-4 sm:-right-12 top-0 bottom-0 flex items-center z-10"
            >
              <button
                onClick={() => handleArrowScroll("right")}
                className="rounded-full bg-white p-1.5 shadow-md border border-gray-200 hover:bg-gray-100 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-200" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}