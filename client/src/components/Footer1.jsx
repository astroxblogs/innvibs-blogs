import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  // Transform the categories into the format the footer expects, using translation keys
  const categoryLinks = {
    titleKey: "footer.categories_title",
    links: blogCategories.map(cat => ({
      nameKey: cat.labelKey,
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
    categoryLinks,
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
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-12 pb-8 md:px-8 md:pt-16 md:pb-10"> {/* Adjusted padding */}
        <div className="text-center mb-10 md:mb-12"> {/* Adjusted margin */}
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-text-primary dark:text-white"> {/* Adjusted font size for mobile */}
            {t('application_name')}
          </h2>
          <p className="mt-2 text-base md:text-md text-text-secondary dark:text-gray-400 max-w-sm mx-auto px-2"> {/* Adjusted font size, max-width, and padding */}
            {t('footer.tagline')}
          </p>
        </div>

        {/* Main grid for sections and newsletter */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 md:gap-x-8"> {/* Adjusted gap for mobile */}
          {footerSections.map((section) => (
            <div key={section.titleKey} className="text-center md:text-left"> {/* Centered text on mobile, left on desktop */}
              <h3 className="text-sm font-semibold text-text-primary dark:text-gray-200 tracking-wider uppercase mb-4">
                {t(section.titleKey)}
              </h3>
              <ul className="space-y-2 md:space-y-3"> {/* Adjusted spacing for mobile links */}
                {section.links.map((link) => (
                  <li key={link.nameKey || link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-text-secondary dark:text-gray-400 hover:text-accent dark:hover:text-white transition-colors duration-200"> {/* Adjusted font size for links */}
                      {t(link.nameKey || link.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter section */}
          <div className="col-span-2 md:col-span-1 text-center md:text-left"> {/* Centered text on mobile, left on desktop */}
            <h3 className="text-sm font-semibold text-text-primary dark:text-gray-200 tracking-wider uppercase mb-4">
              {t('footer.newsletter_title')}
            </h3>
            <form className="flex items-center max-w-xs mx-auto md:mx-0"> {/* Constrain width and center on mobile */}
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
                title={t('footer.subscribe_title')}>
                <FaArrowRight />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar: Copyright and social/theme toggle */}
        <div className="mt-12 pt-6 md:mt-16 md:pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4"> {/* Adjusted top margin, added gap */}
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-0"> {/* Adjusted font size, removed mobile bottom margin */}
            {t('footer.copyright', { year: new Date().getFullYear(), appName: t('application_name') })}
          </p>
          <div className="flex items-center gap-4 sm:gap-5"> {/* Adjusted gap */}
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                title={social.name}
                className="text-gray-500 hover:text-accent dark:hover:text-white transition-colors text-lg"> {/* Increased icon size for better tap target */}
                {social.icon}
              </a>
            ))}
            <div className="border-l border-gray-300 dark:border-gray-700 h-4 sm:h-5"></div> {/* Adjusted height */}
            <button
              onClick={toggleTheme}
              title={t('theme_toggle.toggle_theme_title')}
              className="text-gray-500 hover:text-accent dark:hover:text-white transition-colors flex items-center gap-2 text-sm"> {/* Added flex and gap for text/icon alignment */}
              {theme === "light" ? <FaMoon /> : <FaSun />}
              <span className="hidden sm:inline">{theme === "light" ? t('theme_toggle.dark') : t('theme_toggle.light')} {t('theme_toggle.mode')}</span> {/* Hide text on very small screens */}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}