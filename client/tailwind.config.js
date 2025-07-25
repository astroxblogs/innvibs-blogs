/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'light-bg-primary': '#F7F8F9',
                'light-bg-secondary': '#FFFFFF',
                'dark-bg-primary': '#1A202C',
                'dark-bg-secondary': '#2D3748',
                'text-dark': '#1F2937',
                'text-light': '#F3F4F6',
                'text-muted': '#6B7280',
                'accent': {
                    DEFAULT: '#10B981',
                    light: '#34D399',
                    dark: '#059669',
                },
                'border-light': '#E5E7EB',
                'border-dark': '#4A5568',
            },

            fontFamily: {
                sans: ['ui-sans-serif', 'system-ui', 'Helvetica', 'Arial', 'sans-serif'],
            },

            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        fontFamily: theme('fontFamily.sans').join(', '),
                        'h1, h2, h3, h4, h5, h6': {
                            fontFamily: theme('fontFamily.sans').join(', '),
                            color: theme('colors.text-dark'),
                        },
                        '.dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6': {
                            color: theme('colors.text-light'),
                        },
                    },
                },
            }),
        },
    },

    plugins: [
        require('@tailwindcss/line-clamp'),
        require('tailwind-scrollbar-hide'),
        require('@tailwindcss/typography'),
    ],
};
