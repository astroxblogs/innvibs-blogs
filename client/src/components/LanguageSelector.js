import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
    const { i18n, t } = useTranslation();

    const [open, setOpen] = useState(false);
    const changeLanguage = (newLang) => {
        i18n.changeLanguage(newLang);
        localStorage.setItem('lang', newLang);
        setOpen(false);
    };

    return (
        <div className="relative language-selector">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-1.5 text-sm font-medium shadow-sm"
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                {i18n.language === 'hi' ? t('language_selector.hindi') : t('language_selector.english')}
            </button>
            {open && (
                <ul
                    className="absolute z-50 mt-1 w-36 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden"
                    role="listbox"
                >
                    <li>
                        <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                            onClick={() => changeLanguage('en')}
                            role="option"
                            aria-selected={i18n.language === 'en'}
                        >
                            {t('language_selector.english')}
                        </button>
                    </li>
                    <li>
                        <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                            onClick={() => changeLanguage('hi')}
                            role="option"
                            aria-selected={i18n.language === 'hi'}
                        >
                            {t('language_selector.hindi')}
                        </button>
                    </li>
                </ul>
            )}
        </div>
    );
};

export default LanguageSelector;