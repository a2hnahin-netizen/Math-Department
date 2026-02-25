'use client';

import React from 'react';
import { BookOpen, FileText, Download, Library, Search, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

export default function ResourcesPage() {
    const { t, lang } = useLanguage();
    const [resources, setResources] = React.useState([]);

    React.useEffect(() => {
        const fetchResources = async () => {
            const { data, error } = await supabase
                .from('resources')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });
            if (!error) setResources(data || []);
        };
        fetchResources();
    }, []);

    // Helper to filter resources by category
    const getResources = (cat) => resources.filter(r => r.category === cat || (cat === 'Syllabus & Curriculum' && r.category === 'Syllabus'));

    const resourceCategories = [
        {
            title: t.resources.categories.syllabus.title,
            desc: t.resources.categories.syllabus.desc,
            icon: FileText,
            color: "text-emerald-700",
            bg: "bg-emerald-50",
            categoryKey: "Syllabus"
        },
        {
            title: t.resources.categories.questions.title,
            desc: t.resources.categories.questions.desc,
            icon: Search,
            color: "text-orange-700",
            bg: "bg-orange-50",
            categoryKey: "Question Bank"
        },
        {
            title: t.resources.categories.library.title,
            desc: t.resources.categories.library.desc,
            icon: BookOpen,
            color: "text-blue-700",
            bg: "bg-blue-50",
            categoryKey: "E-Library"
        }
    ];

    return (
        <div className={`min-h-screen bg-slate-50 pt-32 pb-20 px-6 ${lang === 'en' ? 'font-en' : 'font-bn'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 relative">
                    <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-800 font-black text-[10px] uppercase tracking-widest rounded-full mb-6 border border-orange-200">
                        {t.resources.tag}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-[#064e3b] uppercase tracking-tighter mb-6 heading-institutional">
                        {t.resources.title}
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                        {t.resources.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {resourceCategories.map((cat, idx) => {
                        const catResources = resources.filter(r => r.category === cat.categoryKey || (cat.categoryKey === 'Syllabus' && r.category === 'Syllabus & Curriculum'));

                        return (
                            <div key={idx} className={`premium-card p-8 rounded-[2rem] border border-white shadow-xl hover:-translate-y-2 transition-transform duration-300 ${cat.bg}`}>
                                <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm ${cat.color}`}>
                                    <cat.icon size={28} />
                                </div>
                                <h3 className={`text-xl font-black uppercase tracking-tight mb-3 ${cat.color}`}>{cat.title}</h3>
                                <p className="text-slate-600 text-sm font-medium mb-6 leading-relaxed">{cat.desc}</p>

                                <ul className="space-y-3">
                                    {catResources.length > 0 ? catResources.map((item, i) => (
                                        <li key={i}>
                                            <a href={item.file_path ? (item.file_path.startsWith('http') ? item.file_path : `http://127.0.0.1:8000/${item.file_path}`) : '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white/60 rounded-xl hover:bg-white transition-all group cursor-pointer border border-transparent hover:border-slate-200">
                                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide group-hover:text-[#064e3b] truncate pr-2">{item.title}</span>
                                                <Download size={14} className="text-slate-400 group-hover:text-orange-500 transition-colors shrink-0" />
                                            </a>
                                        </li>
                                    )) : (
                                        <li className="text-xs text-slate-400 font-bold italic">{t.resources.emptyCategory}</li>
                                    )}
                                </ul>
                            </div>
                        )
                    })}
                </div>

                <div className="bg-[#042f24] rounded-[3rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-4 mb-6 text-orange-400">
                                <Library size={32} />
                                <span className="text-xs font-black uppercase tracking-[0.3em]">{t.resources.librarySection.tag}</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8 leading-tight whitespace-pre-line">
                                {t.resources.librarySection.title}
                            </h2>
                            <p className="text-emerald-100/80 text-lg leading-relaxed mb-10 font-medium whitespace-pre-line">
                                {t.resources.librarySection.description}
                            </p>
                            <div className="flex flex-wrap gap-6 mb-8">
                                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                                    <div className="text-3xl font-black text-orange-500 mb-1">{t.resources.librarySection.booksCount}</div>
                                    <div className="text-[10px] uppercase tracking-widest text-emerald-200 font-bold">{t.resources.librarySection.booksLabel}</div>
                                </div>
                                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                                    <div className="text-3xl font-black text-white mb-1">{t.resources.librarySection.hoursVal}</div>
                                    <div className="text-[10px] uppercase tracking-widest text-emerald-200 font-bold">{t.resources.librarySection.hoursLabel}</div>
                                </div>
                            </div>
                            <a href="/resources/books" className="inline-flex items-center gap-3 bg-orange-500 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-xl">
                                {t.resources.librarySection.btn} <ChevronRight size={16} />
                            </a>
                        </div>
                        <div className="relative h-80 rounded-[2rem] overflow-hidden border-4 border-white/10 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                            {/* Placeholder for Library Image - using abstract/gradient for now if no image available */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-900 to-[#064e3b]"></div>
                            <img
                                src="https://images.unsplash.com/photo-1507842217121-9e8712e09328?q=80&w=2670&auto=format&fit=crop"
                                alt="Library"
                                className="w-full h-full object-cover opacity-80 mix-blend-overlay"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white font-black uppercase tracking-widest text-xs">{t.resources.librarySection.imageCaption}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
