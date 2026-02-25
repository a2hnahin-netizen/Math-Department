'use client';

import React, { useState, useEffect } from 'react';
import {
    Infinity as InfinityIcon,
    Globe,
    MapPin,
    Phone,
    ArrowRight,
    ChevronRight,
    Send,
    ArrowLeft,
    History,
    Target,
    Users,
    Award,
    BookOpen,
    GraduationCap
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const AboutUs = () => {
    const { lang, setLang, t } = useLanguage();
    const [showMenu, setShowMenu] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Scroll Animation Logic for Floating Menu
    useEffect(() => {
        const handleScroll = () => {
            if (typeof window !== 'undefined') {
                const currentScrollY = window.scrollY;
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    setShowMenu(false);
                } else {
                    setShowMenu(true);
                }
                setLastScrollY(currentScrollY);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <div className={`min-h-screen bg-slate-50 selection:bg-orange-100 selection:text-green-900 ${lang === 'en' ? 'font-en' : 'font-bn'}`}>

            {/* Header removed as it is provided by the global Navbar in layout */}

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="text-center mb-16 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -z-10"></div>
                        <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-800 font-black text-[10px] uppercase tracking-widest rounded-full mb-6 border border-orange-200">
                            {t.about.tag}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-[#064e3b] uppercase tracking-tighter mb-6 heading-institutional">
                            {t.about.title}
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                            {t.about.subtitle}
                        </p>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                        <div className="premium-card p-8 md:p-12 relative overflow-hidden group">
                            {/* Decorative bg */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50 rounded-bl-[100px] -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-[#064e3b] rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg">
                                    <History size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-[#064e3b] uppercase tracking-tighter mb-6">{t.about.historyTitle}</h3>
                                <div className="space-y-4 text-slate-600 leading-relaxed text-sm md:text-base font-medium">
                                    <p>{t.about.historyP1}</p>
                                    <p>{t.about.historyP2}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="premium-card p-8 border-l-8 border-orange-500 flex gap-6 items-start hover:bg-orange-50 transition-colors">
                                <div className="shrink-0 p-3 bg-white rounded-xl shadow-sm text-orange-600"><Target size={24} /></div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">{t.about.visionTitle}</h4>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {t.about.visionDesc}
                                    </p>
                                </div>
                            </div>

                            <div className="premium-card p-8 border-l-8 border-[#064e3b] flex gap-6 items-start hover:bg-emerald-50 transition-colors">
                                <div className="shrink-0 p-3 bg-white rounded-xl shadow-sm text-[#064e3b]"><BookOpen size={24} /></div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">{t.about.missionTitle}</h4>
                                    <ul className="text-slate-600 text-sm leading-relaxed list-disc list-inside space-y-1 marker:text-[#064e3b]">
                                        {t.about.missionPoints.map((point, index) => (
                                            <li key={index}>{point}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Haji Muhammad Mohsin Section */}
                    <div className="mb-24">
                        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">
                                <div className="md:col-span-5 lg:col-span-4">
                                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-4 border-orange-500/20 shadow-2xl group">
                                        <div className="absolute inset-0 bg-[#064e3b]/10 group-hover:bg-transparent transition-colors duration-500"></div>
                                        <img
                                            src="/images/mohsin.png"
                                            alt="Haji Muhammad Mohsin"
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="text-center mt-6">
                                        <h3 className="text-2xl font-black text-[#064e3b] uppercase tracking-tighter">{t.about.mohsin.title}</h3>
                                        <p className="text-orange-600 font-bold uppercase tracking-widest text-xs mt-1">{t.about.mohsin.years}</p>
                                    </div>
                                </div>
                                <div className="md:col-span-7 lg:col-span-8">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 rounded-full text-orange-800 text-[10px] font-black uppercase tracking-widest mb-6">
                                        <Award size={14} /> {t.about.mohsin.tag}
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-black text-slate-800 mb-8 heading-institutional">
                                        {t.about.mohsin.legacyTitle}
                                    </h2>
                                    <div className="space-y-6 text-slate-600 font-medium leading-relaxed text-lg text-justify">
                                        <p>
                                            <span className="text-[#064e3b] font-bold">{t.about.mohsin.title}</span> {t.about.mohsin.p1.replace(t.about.mohsin.title, '')}
                                        </p>
                                        <p>
                                            {t.about.mohsin.p2}
                                        </p>
                                        <p>
                                            {t.about.mohsin.p3}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats / Highlights */}
                    <div className="bg-[#042f24] rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden mb-20">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {[
                                { label: t.about.stats.founded, val: "1874", icon: History },
                                { label: t.about.stats.faculty, val: "18+", icon: Users },
                                { label: t.about.stats.students, val: "1200+", icon: GraduationCap },
                                { label: t.about.stats.publications, val: "50+", icon: Award }
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <stat.icon size={24} className="text-orange-500 mb-4" />
                                    <span className="text-4xl md:text-5xl font-black tracking-tighter mb-2">{stat.val}</span>
                                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="text-center">
                        <a href="/" className="inline-flex items-center gap-3 bg-white border-2 border-[#064e3b] text-[#064e3b] px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#064e3b] hover:text-white transition-all shadow-xl group">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            {t.about.back}
                        </a>
                    </div>
                </div>
            </main>

            {/* Footer removed: handled globally in layout */}
        </div>
    );
};

export default AboutUs;
