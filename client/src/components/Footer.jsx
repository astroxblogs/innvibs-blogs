import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

// The full list of categories you provided
const categories = [
    { label: 'Home', value: 'all' },
    { label: 'Fashion', value: 'fashion' },
    { label: 'Beauty', value: 'beauty' },
    { label: 'Health', value: 'health' },
    { label: 'Yoga Spirituality', value: 'yoga-spirituality' },
    { label: 'Pregnancy', value: 'pregnancy' },
    { label: 'Relationship', value: 'relationship' },
    { label: 'Recipes', value: 'recipes' },
    { label: 'Home n Garden', value: 'home-garden' },
    { label: 'Art Culture', value: 'art-culture' },
    { label: 'Women', value: 'women' },
];

const Footer = () => {
    // Basic navigation links
    const navLinks = [
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Privacy Policy', path: '/privacy' },
    ];

    // Social media links
    const socialLinks = [
        { name: 'LinkedIn', icon: <FaLinkedin size={22} />, url: 'https://linkedin.com/yourprofile' },
        { name: 'Twitter', icon: <FaTwitter size={22} />, url: 'https://twitter.com/yourprofile' },
        { name: 'Instagram', icon: <FaInstagram size={22} />, url: 'https://instagram.com/yourprofile' },
    ];

    // Dynamically split categories for a two-column layout
    const categoryLinks = categories.filter(cat => cat.value !== 'all'); // Exclude 'Home'
    const midPoint = Math.ceil(categoryLinks.length / 2);
    const firstHalfCategories = categoryLinks.slice(0, midPoint);
    const secondHalfCategories = categoryLinks.slice(midPoint);

    // Helper component for consistent link styling
    const FooterLink = ({ to, children }) => (
        <Link
            to={to}
            className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 hover:translate-x-1 inline-block"
        >
            {children}
        </Link>
    );

    // Helper component for section titles
    const FooterTitle = ({ children }) => (
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-wider uppercase mb-4">
            {children}
        </h3>
    );

    return (
        <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-6 py-16">
                {/* Updated grid to 5 columns on large screens to accommodate all categories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

                    {/* Column 1: Brand & Socials (Spans 2 columns on large screens) */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            AstroXHub
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mt-2 mb-6">
                            Discover insights, stories, and ideas that matter. Your daily dose of knowledge and inspiration.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                    className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transform hover:scale-110 transition-all duration-300"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Categories (Part 1) */}
                    <div>
                        <FooterTitle>Categories</FooterTitle>
                        <ul className="space-y-3">
                            {firstHalfCategories.map((cat) => (
                                <li key={cat.value}>
                                    <FooterLink to={`/category/${cat.value}`}>{cat.label}</FooterLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Categories (Part 2) */}
                    <div>
                        <FooterTitle>&nbsp;</FooterTitle> {/* Empty title for alignment */}
                        <ul className="space-y-3">
                            {secondHalfCategories.map((cat) => (
                                <li key={cat.value}>
                                    <FooterLink to={`/category/${cat.value}`}>{cat.label}</FooterLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Quick Links & Newsletter */}
                    <div>
                        <FooterTitle>Company</FooterTitle>
                        <ul className="space-y-3">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <FooterLink to={link.path}>{link.name}</FooterLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* Bottom Section with Newsletter and Copyright */}
                <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <p className="text-sm text-slate-500 dark:text-slate-500">&copy; {new Date().getFullYear()} AstroXHub Blogs. All Rights Reserved.</p>
                    </div>
                    <div className="w-full max-w-md">
                        <form className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="email"
                                placeholder="your.email@example.com"
                                className="w-full px-4 py-2 rounded-md bg-slate-200 dark:bg-slate-800 border border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                                aria-label="Email for newsletter"
                            />
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all duration-300"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
