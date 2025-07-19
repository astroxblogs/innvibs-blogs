import React from 'react';
import { useParams } from 'react-router-dom';
import Home from './Home';

// Helper function to convert URL slug back to the proper category name
// e.g., "health-wellness" -> "Health & Wellness"
const unslugify = (slug) => {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .replace(/ & /g, ' & ');
};

const CategoryPage = () => {
    const { categoryName } = useParams(); // Gets the category from the URL
    const activeCategory = unslugify(categoryName);

    // We reuse the Home component to display the filtered blogs
    return <Home activeCategory={activeCategory} searchQuery="" />;
};

export default CategoryPage;