'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

import { usePathname } from 'next/navigation';

const Navbar = () => {
    const { lang, setLang, t } = useLanguage();
    const [isTopRowVisible, setIsTopRowVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Always show at the very top
            if (currentScrollY < 50) {
                setIsTopRowVisible(true);
            } else {
                // Show if scrolling UP, Hide if scrolling DOWN
                if (currentScrollY < lastScrollY) {
                    setIsTopRowVisible(true);
                } else {
                    setIsTopRowVisible(false);
                }
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const navLinks = [
        { key: 'home', href: '/' },
        { key: 'about', href: '/about' },
        { key: 'notices', href: '/notices' },
        { key: 'faculty', href: '/faculty' },
        { key: 'programs', href: '/programs' },
        { key: 'resources', href: '/resources' },
        { key: 'contact', href: '/contact' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 flex flex-col items-center gap-0 pointer-events-none ${lang === 'en' ? 'font-en' : 'font-bn'}`}>

            {/* Top Row: Branding (Centered) */}
            <div className={`
                w-full flex justify-center overflow-hidden transition-all duration-700 ease-in-out
                ${isTopRowVisible ? 'max-h-[200px] opacity-100 translate-y-0 pt-4 md:pt-6 pb-2 md:pb-4' : 'max-h-0 opacity-0 -translate-y-10 pt-0 pb-0'}
            `}>
                <Link href="/" className="pointer-events-auto flex items-center gap-3 md:gap-4 group bg-[#042f24]/80 backdrop-blur-md rounded-2xl pr-6 pl-2 py-2 border border-white/10 shadow-2xl hover:bg-[#064e3b] transition-colors">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-orange-500 shadow-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
                        <div className="flex flex-col items-center">
                            <span className="text-xl md:text-3xl font-serif font-bold text-[#064e3b]">∑</span>
                            <span className="text-[7px] md:text-[9px] font-bold text-[#ea580c]">1874</span>
                        </div>
                    </div>
                    <div className="flex flex-col text-left drop-shadow-md">
                        <h1 suppressHydrationWarning className="text-white font-black text-xs md:text-xl uppercase tracking-tight leading-none">
                            {t.college}
                        </h1>
                        <p suppressHydrationWarning className="text-orange-400 text-[8px] md:text-xs font-black uppercase tracking-[0.3em] mt-0.5 md:mt-1">
                            {t.dept}
                        </p>
                    </div>
                </Link>
            </div>

            {/* Bottom Row: Navigation Pill (Single Row, Compact, No Scroll) */}
            <div className={`
                flex items-center justify-center gap-0.5 md:gap-1 px-2 py-1.5 md:px-3 md:py-2 rounded-full shadow-2xl transition-all duration-500 pointer-events-auto
                bg-[#042f24]/90 backdrop-blur-md
                border border-white/10 mx-auto w-fit max-w-[100vw]
            `}>

                {/* Desktop/Mobile consolidated Links */}
                <div className="flex items-center flex-nowrap">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.key}
                                href={link.href}
                                suppressHydrationWarning
                                className={`
                                    flex-shrink-0 px-1.5 md:px-3 py-1.5 rounded-full text-[8px] sm:text-[9px] md:text-[11px] font-black uppercase tracking-widest 
                                    ${isActive ? 'text-orange-400 bg-white/10 hover:text-orange-400' : 'text-emerald-100 hover:text-white'}
                                    hover:bg-white/10 transition-all relative group whitespace-nowrap
                                    ${lang === 'en' ? 'font-en' : 'font-bn'}
                                `}
                            >
                                {t.nav[link.key] || link.key}
                            </Link>
                        );
                    })}
                </div>

                {/* Language Toggle */}
                <div className="h-3 md:h-4 w-px bg-white/20 mx-0.5 md:mx-1 flex-shrink-0"></div>
                <button
                    onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                    suppressHydrationWarning
                    className="
                        shrink-0 flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-full 
                        text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all shadow-md group whitespace-nowrap
                    "
                >
                    <Globe size={10} className="group-hover:rotate-12 transition-transform md:w-3 md:h-3" />
                    {lang === 'en' ? 'বাংলা' : 'EN'}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
