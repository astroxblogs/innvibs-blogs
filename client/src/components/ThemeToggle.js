// client/src/components/ThemeToggle.js
import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <button
            onClick={toggleTheme}
            className="
                p-2 rounded-full
                bg-light-bg-secondary dark:bg-dark-bg-secondary
                shadow-md transition-colors duration-300 ease-in-out
                flex items-center justify-center
                focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-75
            "
            aria-label={theme === 'light' ? "Switch to dark mode" : "Switch to light mode"}
        >
            {theme === 'light' ? (
                // Moon icon: Dark text in light mode. This is already a very dark gray.
                <span className="material-icons text-xl text-text-dark dark:text-black hover:text-accent-dark dark:hover:text-accent-light">dark_mode</span>
            ) : (
                // Sun icon: Now will be pure black in dark mode.
                <span className="material-icons text-xl text-text-dark dark:text-black hover:text-accent-dark dark:hover:text-accent-light">light_mode</span>
            )}
        </button>
    );
};

export default ThemeToggle;