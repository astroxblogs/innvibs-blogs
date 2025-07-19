import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaSun,
  FaMoon,
  FaArrowRight,
} from "react-icons/fa";

// 1. Define your blog categories
const blogCategories = [
  { label: "Technology", value: "Technology" },
  { label: "Fashion", value: "Fashion" },
  { label: "Health & Wellness", value: "Health & Wellness" },
  { label: "Travel", value: "Travel" },
  { label: "Food & Cooking", value: "Food & Cooking" },
  { label: "Sports", value: "Sports" },
  { label: "Business & Finance", value: "Business & Finance" },
  { label: "Lifestyle", value: "Lifestyle" },
];

// 2. Transform the categories into the format the footer expects
const categoryLinks = {
  title: "Categories",
  links: blogCategories.map(cat => ({
    name: cat.label,
    // This creates a URL-friendly path, e.g., /category/health-wellness
    path: `/category/${cat.value.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`
  }))
};

const footerSections = [
  {
    title: "Company",
    links: [
      { name: "About Us", path: "/about" },
      { name: "Careers", path: "/careers" },
      { name: "Contact", path: "/contact" },
    ],
  },
  // 3. Replaced the old "Product" section with your new category links
  categoryLinks,
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
    ],
  },
];

const socialLinks = [
  { name: "LinkedIn", icon: <FaLinkedin />, url: "https://linkedin.com" },
  { name: "Twitter", icon: <FaTwitter />, url: "https://twitter.com" },
  { name: "Instagram", icon: <FaInstagram />, url: "https://instagram.com" },
];

const useTheme = () => {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  return { theme, toggleTheme };
};

export default function BalancedMonumentFooter() {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="bg-off-background dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-screen-xl mx-auto px-6 pt-16 pb-10">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-text-primary dark:text-white">
            AstroXHub
          </h2>
          <p className="mt-3 text-md text-text-secondary dark:text-gray-400 max-w-md mx-auto">
            A curated space for insights, stories, and ideas that matter.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-text-primary dark:text-gray-200 tracking-wider uppercase mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-text-secondary dark:text-gray-400 hover:text-accent dark:hover:text-white transition-colors duration-200">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-semibold text-text-primary dark:text-gray-200 tracking-wider uppercase mb-4">
              Stay in the loop
            </h3>
            <form className="flex items-center">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-white dark:bg-black px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-l-md focus:ring-2 focus:ring-accent focus:outline-none transition-colors"
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                className="bg-accent text-white p-2.5 rounded-r-md hover:bg-opacity-90 transition-colors"
                aria-label="Subscribe to newsletter"
                title="Subscribe">
                <FaArrowRight />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} AstroXHub
          </p>
          <div className="flex items-center gap-5">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                title={social.name}
                className="text-gray-500 hover:text-accent dark:hover:text-white transition-colors">
                {social.icon}
              </a>
            ))}
            <div className="border-l border-gray-300 dark:border-gray-700 h-5"></div>
            <button
              onClick={toggleTheme}
              title="Toggle theme"
              className="text-gray-500 hover:text-accent dark:hover:text-white transition-colors">
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}