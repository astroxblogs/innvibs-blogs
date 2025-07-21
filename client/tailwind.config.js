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
                // ... your custom colors ...
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

            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        // This sets the base font to serif
                        fontFamily: `Georgia, ${defaultTheme.fontFamily.serif.join(', ')}`,

                        // --- THIS IS THE NEW FIX ---
                        // This forces all headings to also use the serif font
                        'h1, h2, h3, h4, h5, h6': {
                            fontFamily: `Georgia, ${defaultTheme.fontFamily.serif.join(', ')}`,
                            color: theme('colors.text-dark'),
                        },
                        // This handles heading colors in dark mode
                        '.dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6': {
                            color: theme('colors.text-light'),
                        }
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