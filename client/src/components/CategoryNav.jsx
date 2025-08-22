import React, { useRef, useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const scrollRef = useRef(null);
  const itemRefs = useRef([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    setMobileOpen(false);

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
      {/* Mobile: dropdown on hover/tap */}
      <div
        className="relative mx-auto block max-w-2xl sm:hidden"
        onMouseEnter={() => setMobileOpen(true)}
        onMouseLeave={() => setMobileOpen(false)}
      >
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="w-full flex justify-between items-center rounded-md px-4 py-2 text-sm font-medium bg-white border border-gray-200 shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          aria-expanded={mobileOpen}
          aria-haspopup="true"
        >
          {t('navigation.categories')}
          <ChevronRight className={`h-4 w-4 transition-transform ${mobileOpen ? "rotate-90" : "rotate-0"}`} />
        </button>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 right-0 mt-2 rounded-md border border-gray-200 bg-white shadow-lg dark:bg-gray-900 dark:border-gray-700 z-20"
            >
              <ul className="py-2">
                {categories.map((cat) => (
                  <li key={cat.value}>
                    <button
                      onClick={() => handleCategoryClick(cat.value)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeCategory === cat.value
                          ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                          : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                        }`}
                    >
                      {t(`category.${String(cat.value).toLowerCase().replace(/ & /g, '_').replace(/\s+/g, '_')}`, { defaultValue: cat.label })}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop/tablet: keep existing horizontal nav */}
      <div className="relative mx-auto hidden sm:flex max-w-2xl items-center">
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
              {t(`category.${String(cat.value).toLowerCase().replace(/ & /g, '_').replace(/\s+/g, '_')}`, { defaultValue: cat.label })}
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

