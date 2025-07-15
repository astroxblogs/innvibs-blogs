// src/components/LanguageSelector.jsx
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    return (
        <select onChange={(e) => changeLanguage(e.target.value)} defaultValue={i18n.language}>
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="fr">Français</option>
            <option value="es">Español</option> {/* ✅ Added */}
        </select>

    );
};

export default LanguageSelector;
