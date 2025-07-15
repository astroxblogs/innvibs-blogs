import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ThemeToggle = () => {
    const { t } = useTranslation();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <button
            className="px-4 py-2 rounded-lg bg-white/80 text-gray-800 dark:bg-[#1e1e2f]/70 dark:text-gray-100 dark:hover:bg-[#2a2a3d]/80 shadow-md backdrop-blur-md transition-all duration-300"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
            {t('theme')}: {theme === 'light' ? t('light') : t('dark')}
        </button>


    );
};

export default ThemeToggle; 