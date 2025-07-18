"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { label: "Home", value: "all" },
  { label: "Fashion", value: "fashion" },
  { label: "Beauty", value: "beauty" },
  { label: "Health", value: "health" },
  { label: "Spirituality", value: "spirituality" },
  { label: "Relationships", value: "relationship" },
  { label: "Recipes", value: "recipes" },
  { label: "Home & Garden", value: "home-garden" },
  { label: "Art & Culture", value: "art-culture" },
  { label: "Technology", value: "technology" },
];

export default function CategoryNav() {
  const [activeCategory, setActiveCategory] = useState(categories[0].value);
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    const isScrollable = el.scrollWidth > el.clientWidth;
    setShowLeftArrow(isScrollable && el.scrollLeft > 1);
    setShowRightArrow(
      isScrollable && el.scrollWidth - el.clientWidth - el.scrollLeft > 1
    );
  };

  useEffect(() => {
    // Initial check and setup listeners
    const el = scrollRef.current;
    checkArrows();
    el?.addEventListener("scroll", checkArrows);
    window.addEventListener("resize", checkArrows);
    return () => {
      el?.removeEventListener("scroll", checkArrows);
      window.removeEventListener("resize", checkArrows);
    };
  }, []);

  const handleCategoryClick = (categoryValue: string) => {
    setActiveCategory(categoryValue);
    const categoryIndex = categories.findIndex(
      (c) => c.value === categoryValue
    );
    const itemEl = itemRefs.current[categoryIndex];
    const scrollEl = scrollRef.current;

    if (itemEl && scrollEl) {
      const scrollAmount =
        itemEl.offsetLeft - scrollEl.offsetWidth / 2 + itemEl.offsetWidth / 2;
      scrollEl.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleArrowScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full bg-background py-2 ">
      <div className="relative mx-auto flex max-w-2xl items-center">
        {/* Left Arrow Button */}
        <AnimatePresence>
          {showLeftArrow && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -left-12 top-0 bottom-0 flex items-center z-10">
              <button
                onClick={() => handleArrowScroll("left")}
                className="rounded-full bg-white p-1.5 shadow-md border border-gray-200 hover:bg-gray-100 transition-colors"
                aria-label="Scroll left">
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable Categories Container */}
        <div
          ref={scrollRef}
          className="flex items-center space-x-3 overflow-x-auto whitespace-nowrap scroll-smooth no-scrollbar px-2">
          {categories.map((cat, idx) => (
            <button
              key={cat.value}
              ref={(el) => (itemRefs.current[idx] = el)}
              onClick={() => handleCategoryClick(cat.value)}
              className={`
                                flex-shrink-0 rounded-full px-4 py-1 text-sm font-medium transition-colors duration-200
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
                                ${
                                  activeCategory === cat.value
                                    ? "bg-accent text-white"
                                    : "text-text-secondary hover:text-text-primary hover:bg-off-background"
                                }
                            `}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Right Arrow Button */}
        <AnimatePresence>
          {showRightArrow && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -right-12 top-0 bottom-0 flex items-center z-10">
              <button
                onClick={() => handleArrowScroll("right")}
                className="rounded-full bg-white p-1.5 shadow-md border border-gray-200 hover:bg-gray-100 transition-colors"
                aria-label="Scroll right">
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
