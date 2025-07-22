import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next'; // <-- Import useTranslation
import {
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaSun,
  FaMoon,
  FaArrowRight,
} from "react-icons/fa";

// Define your blog categories with translation keys
const blogCategories = [
  { labelKey: "category.technology", value: "Technology" },
  { labelKey: "category.fashion", value: "Fashion" },
  { labelKey: "category.health_wellness", value: "Health & Wellness" },
  { labelKey: "category.travel", value: "Travel" },
  { labelKey: "category.food_cooking", value: "Food & Cooking" },
  { labelKey: "category.sports", value: "Sports" },
  { labelKey: "category.business_finance", value: "Business & Finance" },
  { labelKey: "category.lifestyle", value: "Lifestyle" },
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
  const { t } = useTranslation(); // <-- Initialize t for translations

  // Transform the categories into the format the footer expects, using translation keys
  const categoryLinks = {
    titleKey: "footer.categories_title", // Translation key for "Categories" title
    links: blogCategories.map(cat => ({
      nameKey: cat.labelKey, // Use the translation key for the name
      path: `/category/${cat.value.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`
    }))
  };

  // Define footer sections with translation keys
  const footerSections = [
    {
      titleKey: "footer.company_title",
      links: [
        { nameKey: "footer.about_us", path: "/about" },
        { nameKey: "footer.careers", path: "/careers" },
        { nameKey: "footer.contact", path: "/contact" },
      ],
    },
    categoryLinks, // Your dynamic category links
    {
      titleKey: "footer.legal_title",
      links: [
        { nameKey: "footer.privacy_policy", path: "/privacy" },
        { nameKey: "footer.terms_of_service", path: "/terms" },
      ],
    },
  ];

  const socialLinks = [
    { name: "LinkedIn", icon: <FaLinkedin />, url: "https://linkedin.com" },
    { name: "Twitter", icon: <FaTwitter />, url: "https://twitter.com" },
    { name: "Instagram", icon: <FaInstagram />, url: "https://instagram.com" },
  ];

  return (
    <footer className="bg-off-background dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-screen-xl mx-auto px-6 pt-16 pb-10">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-text-primary dark:text-white">
            {t('application_name')} {/* Translated application name */}
          </h2>
          <p className="mt-3 text-md text-text-secondary dark:text-gray-400 max-w-md mx-auto">
            {t('footer.tagline')} {/* Translated tagline */}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerSections.map((section) => (
            <div key={section.titleKey}> {/* Use titleKey as key */}
              <h3 className="text-sm font-semibold text-text-primary dark:text-gray-200 tracking-wider uppercase mb-4">
                {t(section.titleKey)} {/* Translated section title */}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.nameKey || link.name}> {/* Use nameKey or fallback to name for key */}
                    <Link
                      to={link.path}
                      className="text-text-secondary dark:text-gray-400 hover:text-accent dark:hover:text-white transition-colors duration-200">
                      {t(link.nameKey || link.name)} {/* Translated link name, fallback to original if no key */}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-semibold text-text-primary dark:text-gray-200 tracking-wider uppercase mb-4">
              {t('footer.newsletter_title')} {/* Translated */}
            </h3>
            <form className="flex items-center">
              <input
                type="email"
                placeholder={t('footer.email_placeholder')} 
                className="w-full bg-white dark:bg-black px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-l-md focus:ring-2 focus:ring-accent focus:outline-none transition-colors"
                aria-label={t('footer.email_aria_label')} 
              />
              <button
                type="submit"
                className="bg-accent text-white p-2.5 rounded-r-md hover:bg-opacity-90 transition-colors"
                aria-label={t('footer.subscribe_aria_label')} 
                title={t('footer.subscribe_title')}> {/* Translated */}
                <FaArrowRight />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
            {t('footer.copyright', { year: new Date().getFullYear(), appName: t('application_name') })} {/* Translated with interpolation */}
          </p>
          <div className="flex items-center gap-5">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                title={social.name} // Assuming social.name is a fixed identifier, not displayed directly
                className="text-gray-500 hover:text-accent dark:hover:text-white transition-colors">
                {social.icon}
              </a>
            ))}
            <div className="border-l border-gray-300 dark:border-gray-700 h-5"></div>
            <button
              onClick={toggleTheme}
              title={t('theme_toggle.toggle_theme_title')} // Translated theme toggle title
              className="text-gray-500 hover:text-accent dark:hover:text-white transition-colors">
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}