import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaLinkedin, FaTwitter, FaInstagram, FaSun, FaMoon, FaArrowRight } from 'react-icons/fa';

// Curated, essential link structure with translation keys
const footerSections = [
    {
        titleKey: 'footer.company_title',
        links: [
            { nameKey: 'footer.about_us', path: '/about' },
            { nameKey: 'footer.careers', path: '/careers' },
            { nameKey: 'footer.contact', path: '/contact' }
        ]
    },
    {
        titleKey: 'footer.product_title',
        links: [
            { nameKey: 'footer.features', path: '/features' },
            { nameKey: 'footer.pricing', path: '/pricing' },
            { nameKey: 'footer.changelog', path: '/changelog' }
        ]
    },
    {
        titleKey: 'footer.legal_title',
        links: [
            { nameKey: 'footer.privacy_policy', path: '/privacy' },
            { nameKey: 'footer.terms_of_service', path: '/terms' }
        ]
    },
];

const socialLinks = [
    { name: 'LinkedIn', icon: <FaLinkedin />, url: 'https://linkedin.com' },
    { name: 'Twitter', icon: <FaTwitter />, url: 'https://twitter.com' },
    { name: 'Instagram', icon: <FaInstagram />, url: 'https://instagram.com' },
];

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
    const { t } = useTranslation();

    return (
        <footer className="bg-off-background dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 md:px-8 md:py-16"> {/* Adjusted padding */}

                {/* Main grid: Asymmetrical layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12"> {/* Adjusted gap */}

                    {/* LEFT COLUMN: The Brand Block */}
                    <div className="md:col-span-4 text-center md:text-left"> {/* Centered on mobile, left on desktop */}
                        <h2 className="text-4xl md:text-4xl font-bold tracking-tighter text-text-primary dark:text-white"> {/* Adjusted font size for mobile */}
                            {t('application_name')}
                        </h2>
                        <p className="mt-2 text-base md:text-md text-text-secondary dark:text-gray-400 max-w-xs mx-auto md:mx-0"> {/* Adjusted font size, max-width, center on mobile */}
                            {t('footer.tagline')}
                        </p>
                        <div className="mt-6 flex justify-center md:justify-start items-center gap-4"> {/* Adjusted margin, centered on mobile */}
                            {socialLinks.map((social) => (
                                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" title={social.name} className="text-gray-500 hover:text-accent dark:hover:text-white transition-colors text-lg"> {/* Increased icon size */}
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: The Utility Grid */}
                    <div className="md:col-span-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 md:gap-x-8"> {/* Adjusted gap for mobile */}
                            {footerSections.map((section) => (
                                <div key={section.titleKey} className="text-center md:text-left"> {/* Centered on mobile, left on desktop */}
                                    <h3 className="text-sm font-semibold text-text-primary dark:text-gray-200 tracking-wider uppercase mb-4">
                                        {t(section.titleKey)}
                                    </h3>
                                    <ul className="space-y-2 md:space-y-3"> {/* Adjusted spacing for mobile links */}
                                        {section.links.map((link) => (
                                            <li key={link.nameKey}>
                                                <Link to={link.path} className="text-sm text-text-secondary dark:text-gray-400 hover:text-accent dark:hover:text-white transition-colors duration-200"> {/* Adjusted font size for links */}
                                                    {t(link.nameKey)}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                            <div className="col-span-2 md:col-span-1 text-center md:text-left"> {/* Centered on mobile, left on desktop */}
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
                                        title={t('footer.subscribe_title')}
                                    >
                                        <FaArrowRight />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* THE FOUNDATION: Final utility bar */}
                <div className="mt-12 pt-6 md:mt-16 md:pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4"> {/* Adjusted top margin, added gap */}
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-0"> {/* Adjusted font size, removed mobile bottom margin */}
                        {t('footer.copyright', { year: new Date().getFullYear(), appName: t('application_name') })}
                    </p>
                    <button
                        onClick={toggleTheme}
                        title={t('theme_toggle.toggle_theme_title')}
                        aria-label={t('theme_toggle.toggle_theme_title')}
                        className="text-gray-500 hover:text-accent dark:hover:text-white transition-colors flex items-center gap-2 text-sm"> {/* Added flex and gap for text/icon alignment */}
                        {theme === 'light' ? <FaMoon /> : <FaSun />}
                        <span className="hidden sm:inline">{theme === 'light' ? t('theme_toggle.dark') : t('theme_toggle.light')} {t('theme_toggle.mode')}</span> {/* Hide text on very small screens */}
                    </button>
                </div>
            </div>
        </footer>
    );
};