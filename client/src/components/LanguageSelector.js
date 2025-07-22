import React from 'react'; // React import is good practice
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
    const { i18n, t } = useTranslation(); // Destructure 't' function as well

    const changeLanguage = (event) => { // Accept event to get value from target
        const newLang = event.target.value;
        i18n.changeLanguage(newLang);
        // Persist the selected language in localStorage
        localStorage.setItem('lang', newLang);
    };

    return (
        <div className="language-selector flex items-center"> {/* Added flex container */}
            {/* Optional label for accessibility, hidden visually */}
            <label htmlFor="language-select" className="sr-only">
                {t('language_selector.select_language')}
            </label>
            <select
                id="language-select" // Added ID for label
                onChange={changeLanguage}
                value={i18n.language} // Use 'value' to control the selected option
                className="
          p-2 border rounded-md shadow-sm
          bg-white text-gray-900
          dark:bg-gray-700 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-colors duration-200
        "
            >
                <option value="en">{t('language_selector.english')}</option>
                <option value="es">{t('language_selector.spanish')}</option>
                <option value="fr">{t('language_selector.french')}</option>
                <option value="hi">{t('language_selector.hindi')}</option>
            </select>
        </div>
    );
};

export default LanguageSelector;