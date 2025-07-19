// import React from 'react';
// import { useTranslation } from 'react-i18next';

// const LanguageToggle = () => {
//     const { i18n, t } = useTranslation();

//     const changeLanguage = (lng) => {
//         i18n.changeLanguage(lng);
//         localStorage.setItem('lang', lng);
//         window.location.reload();
//     };

//     return (
//         <div>
//             <span className="mr-2">{t('language')}:</span>
//             <button
//                 className={`px-2 ${i18n.language === 'en' ? 'font-bold' : ''}`}
//                 onClick={() => changeLanguage('en')}
//             >
//                 EN
//             </button>
//             <button
//                 className={`px-2 ${i18n.language === 'hi' ? 'font-bold' : ''}`}
//                 onClick={() => changeLanguage('hi')}
//             >
//                 HI
//             </button>
//         </div>
//     );
// };

// export default LanguageToggle; 