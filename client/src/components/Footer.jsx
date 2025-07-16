import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Privacy Policy', path: '/privacy' },
    ];

    const socialLinks = [
        { name: 'LinkedIn', icon: <FaLinkedin size={20} />, url: 'https://linkedin.com/yourprofile' },
        { name: 'Twitter', icon: <FaTwitter size={20} />, url: 'https://twitter.com/yourprofile' },
        { name: 'Instagram', icon: <FaInstagram size={20} />, url: 'https://instagram.com/yourprofile' },
    ];

    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left">

                    {/* Brand Section */}
                    <div className="mb-6 md:mb-0 md:w-1/3">
                        <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors">
                            MyBlog
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-xs mx-auto md:mx-0">
                            Discover insights, stories, and ideas that matter. Your daily dose of knowledge and inspiration.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="mb-6 md:mb-0 md:w-1/3">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Quick Links</h3>
                        <ul className="space-y-2">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div className="md:w-1/3">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Connect With Us</h3>
                        <div className="flex justify-center md:justify-start space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Line */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-500">
                    &copy; {new Date().getFullYear()} MyBlog. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
