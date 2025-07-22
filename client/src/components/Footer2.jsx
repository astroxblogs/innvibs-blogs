import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // <-- Import useTranslation
import { FaLinkedin, FaTwitter, FaInstagram, FaSun, FaMoon, FaArrowRight } from 'react-icons/fa';

// Curated, essential link structure with translation keys
const footerSections = [
    {
        titleKey: 'footer.company_title', // Added translation key
        links: [
            { nameKey: 'footer.about_us', path: '/about' }, // Added translation key
            { nameKey: 'footer.careers', path: '/careers' }, // Added translation key
            { nameKey: 'footer.contact', path: '/contact' } // Added translation key
        ]
    },
    {
        titleKey: 'footer.product_title', // Added translation key
        links: [
            { nameKey: 'footer.features', path: '/features' }, // Added translation key
            { nameKey: 'footer.pricing', path: '/pricing' }, // Added translation key
            { nameKey: 'footer.changelog', path: '/changelog' } // Added translation key
        ]
    },
    {
        titleKey: 'footer.legal_title', // Added translation key
        links: [
            { nameKey: 'footer.privacy_policy', path: '/privacy' }, // Added translation key
            { nameKey: 'footer.terms_of_service', path: '/terms' } // Added translation key
        ]
    },
];

const socialLinks = [
    { name: 'LinkedIn', icon: <FaLinkedin />, url: 'https://linkedin.com' },
    { name: 'Twitter', icon: <FaTwitter />, url: 'https://twitter.com' },
    { name: 'Instagram', icon: <FaInstagram />, url: 'https://instagram.com' },
];

// Example theme hook
const useTheme = () => {
    const [theme, setTheme] = useState('light');
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
    return { theme, toggleTheme };
};

export default function EditorialFooter() {
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation(); // <-- Initialize t for translations

    return (
        <footer className="bg-off-background dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-screen-xl mx-auto px-6 py-16">

                {/* Main grid: Asymmetrical layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT COLUMN: The Brand Block */}
                    <div className="lg:col-span-4">
                        <h2 className="text-4xl font-bold tracking-tighter text-text-primary dark:text-white">
                            {t('application_name')} {/* Translated application name */}
                        </h2>
                        <p className="mt-3 text-md text-text-secondary dark:text-gray-400 max-w-xs">
                            {t('footer.tagline')} {/* Translated tagline */}
                        </p>
                        <div className="mt-8 flex items-center gap-5">
                            {socialLinks.map((social) => (
                                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" title={social.name} className="text-gray-500 hover:text-accent dark:hover:text-white transition-colors">
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: The Utility Grid */}
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {footerSections.map((section) => (
                                <div key={section.titleKey}> {/* Use titleKey as key */}
                                    <h3 className="text-sm font-semibold text-text-primary dark:text-gray-200 tracking-wider uppercase mb-4">
                                        {t(section.titleKey)} {/* Translated section title */}
                                    </h3>
                                    <ul className="space-y-3">
                                        {section.links.map((link) => (
                                            <li key={link.nameKey}> {/* Use nameKey as key */}
                                                <Link to={link.path} className="text-text-secondary dark:text-gray-400 hover:text-accent dark:hover:text-white transition-colors duration-200">
                                                    {t(link.nameKey)} {/* Translated link name */}
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
                                        placeholder={t('footer.email_placeholder')} {/* Translated placeholder */}
                                        className="w-full bg-white dark:bg-black px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-l-md focus:ring-2 focus:ring-accent focus:outline-none transition-colors"
                                        aria-label={t('footer.email_aria_label')} {/* Translated */}
                                    />
                                    <button
                                        type="submit"
                                        className="bg-accent text-white p-2.5 rounded-r-md hover:bg-opacity-90 transition-colors"
                                        aria-label={t('footer.subscribe_aria_label')} {/* Translated */}
                                        title={t('footer.subscribe_title')} {/* Translated */}
                                    >
                                        <FaArrowRight />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* THE FOUNDATION: Final utility bar */}
                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
                        {t('footer.copyright', { year: new Date().getFullYear(), appName: t('application_name') })} {/* Translated with interpolation */}
                    </p>
                    <button
                        onClick={toggleTheme}
                        title={t('theme_toggle.toggle_theme_title')} // Translated theme toggle title
                        aria-label={t('theme_toggle.toggle_theme_title')} // Translated theme toggle aria-label
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-accent dark:hover:text-white transition-colors">
                        {theme === 'light' ? <FaMoon /> : <FaSun />}
                        <span>{theme === 'light' ? t('theme_toggle.dark') : t('theme_toggle.light')} {t('theme_toggle.mode')}</span> {/* Translated mode text */}
                    </button>
                </div>
            </div>
        </footer>
    );
};