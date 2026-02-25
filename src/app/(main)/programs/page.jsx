'use client';

import React from 'react';
import { BookOpen, GraduationCap, Award, ExternalLink, Download } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ProgramsPage() {
    const { t, lang } = useLanguage();

    const programs = [
        {
            id: 'hsc',
            title: t.programs.list.hsc.title,
            desc: t.programs.list.hsc.desc,
            icon: GraduationCap,
            color: "text-emerald-700",
            bg: "bg-emerald-50",
            border: "border-emerald-200",
            courses: t.programs.list.hsc.courses
        },
        {
            id: 'honours',
            title: t.programs.list.honours.title,
            desc: t.programs.list.honours.desc,
            icon: BookOpen,
            color: "text-orange-700",
            bg: "bg-orange-50",
            border: "border-orange-200",
            courses: t.programs.list.honours.courses
        },
        {
            id: 'masters',
            title: t.programs.list.masters.title,
            desc: t.programs.list.masters.desc,
            icon: Award,
            color: "text-blue-700",
            bg: "bg-blue-50",
            border: "border-blue-200",
            courses: t.programs.list.masters.courses
        }
    ];

    return (
        <div className={`min-h-screen bg-slate-50 pt-32 pb-20 px-6 ${lang === 'en' ? 'font-en' : 'font-bn'}`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 relative">
                    <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-800 font-black text-[10px] uppercase tracking-widest rounded-full mb-6 border border-orange-200 shadow-sm">
                        {t.programs.tag}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-[#064e3b] uppercase tracking-tighter mb-6 heading-institutional">
                        {t.programs.title}
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                        {t.programs.subtitle}
                    </p>
                </div>

                {/* Programs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {programs.map((program) => (
                        <div key={program.id} className={`premium-card p-8 rounded-[2rem] border-2 ${program.border} ${program.bg} hover:shadow-2xl transition-all relative overflow-hidden group`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>

                            <div className={`w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-md ${program.color}`}>
                                <program.icon size={32} />
                            </div>

                            <h3 className={`text-2xl font-black uppercase tracking-tight mb-4 ${program.color}`}>
                                {program.title}
                            </h3>
                            <p className="text-slate-700 font-medium mb-8 leading-relaxed">
                                {program.desc}
                            </p>

                            <div className="space-y-4 mb-8">
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-2">{t.programs.keySubjects}</h4>
                                <ul className="space-y-2">
                                    {program.courses.map((course, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                            <div className={`w-1.5 h-1.5 rounded-full ${program.color.replace('text-', 'bg-')}`}></div>
                                            {course}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <a href="/resources" className={`w-full bg-white border-2 border-transparent hover:border-current py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-sm flex items-center justify-center gap-2 ${program.color} transition-all`}>
                                {t.programs.viewSyllabus} <ExternalLink size={14} />
                            </a>
                        </div>
                    ))}
                </div>

                {/* Resources Call to Action */}
                <div className="bg-[#042f24] rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 max-w-2xl">
                        <h3 className="text-3xl font-black uppercase tracking-tight mb-4">{t.programs.cta.title}</h3>
                        <p className="text-emerald-100/80 text-lg font-medium">{t.programs.cta.desc}</p>
                    </div>
                    <a href="/resources" className="relative z-10 bg-orange-500 text-white px-10 py-5 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-xl flex items-center gap-3 shrink-0">
                        {t.programs.cta.btn} <Download size={18} />
                    </a>
                </div>
            </div>
        </div>
    );
}
