'use client';

import React, { createContext, useContext, useState } from 'react';
import { content } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState('en');

    const toggleLang = () => {
        setLang((prev) => (prev === 'en' ? 'bn' : 'en'));
    };

    const t = content[lang];

    return (
        <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
