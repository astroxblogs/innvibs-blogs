import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
    const { i18n, t } = useTranslation();

    const changeLanguage = (event) => {
        const newLang = event.target.value;
        i18n.changeLanguage(newLang);
        localStorage.setItem('lang', newLang);
    };

    return (
        // The outer div might not need specific width/height, but ensure it allows content to breathe
        <div className="language-selector flex items-center">
            <label htmlFor="language-select" className="sr-only">
                {t('language_selector.select_language')}
            </label>
            <select
                id="language-select"
                onChange={changeLanguage}
                value={i18n.language}
                className="
                    p-2 border rounded-md shadow-sm
                    bg-white text-gray-900
                    dark:bg-gray-700 dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    transition-colors duration-200
                    w-auto min-w-[100px]  // Added auto width and minimum width
                    px-3 py-2               // Adjusted padding for better fit
                "
            >
                <option value="en">{t('language_selector.english')}</option>
                <option value="hi">{t('language_selector.hindi')}</option>
            </select>
        </div>
    );
};

export default LanguageSelector;