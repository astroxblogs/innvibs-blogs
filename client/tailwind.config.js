/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // --- Custom Aesthetic & Minimalistic Palette ---
                // Light Mode Backgrounds
                'light-bg-primary': '#F7F8F9', // Very light off-white for overall page background
                'light-bg-secondary': '#FFFFFF', // Pure white for cards, panels, and forms

                // Dark Mode Backgrounds
                'dark-bg-primary': '#1A202C', // Deep, muted charcoal/dark navy for overall page background
                'dark-bg-secondary': '#2D3748', // Slightly lighter shade for cards, panels, forms

                // Text Colors
                'text-dark': '#1F2937',    // Dark grey for text in light mode
                'text-light': '#F3F4F6',   // Light grey for text in dark mode
                'text-muted': '#6B7280',   // Muted grey for secondary text/icons

                // Accent Color (a subtle, modern green/teal)
                'accent': {
                    DEFAULT: '#10B981', // A nice vibrant-but-not-too-bright emerald green (emerald-500 equivalent)
                    light: '#34D399',  // Lighter for hover in dark mode
                    dark: '#059669',   // Darker for hover in light mode
                },

                // Border Colors
                'border-light': '#E5E7EB', // Light border for light mode
                'border-dark': '#4A5568',  // Darker border for dark mode
                // ---------------------------------------------
            },
        },
    },






    plugins: [
        require('@tailwindcss/line-clamp'),
        require('tailwind-scrollbar-hide'),
    ],
};
