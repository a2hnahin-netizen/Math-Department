'use client';

import React, { useState, useEffect } from 'react';
import {
    Mail,
    UserCircle,
    Phone,
    GraduationCap,
    BookOpen,
    ArrowLeft,
    Globe,
    Infinity as InfinityIcon,
    MapPin,
    ChevronRight,
    Send
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

const FacultyPage = () => {
    const { lang, setLang, t } = useLanguage();
    const [facultyMembers, setFacultyMembers] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const { data, error } = await supabase
                    .from('faculty')
                    .select('*')
                    .eq('is_active', true)
                    .order('order', { ascending: true });

                if (data) setFacultyMembers(data);
                if (error) throw error;
            } catch (err) {
                console.error('Failed to fetch faculty:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFaculty();
    }, []);



    return (
        <div className={`min-h-screen bg-slate-50 selection:bg-orange-100 selection:text-green-900 ${lang === 'en' ? 'font-en' : 'font-bn'}`}>



            <main className="pt-40 md:pt-48 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
                        <h1 className="text-4xl md:text-6xl font-black text-[#064e3b] uppercase tracking-tighter mb-4 heading-institutional">
                            {t.faculty.title}
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg text-slate-600 font-medium leading-relaxed">
                            {t.faculty.subtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {loading ? (
                            Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-[2rem] p-8 animate-pulse border border-slate-100 shadow-sm">
                                    <div className="w-32 h-32 bg-slate-100 rounded-3xl mx-auto mb-6"></div>
                                    <div className="h-6 bg-slate-100 rounded w-3/4 mx-auto mb-3"></div>
                                    <div className="h-4 bg-slate-50 rounded w-1/2 mx-auto mb-6"></div>
                                    <div className="flex justify-center gap-3">
                                        <div className="w-10 h-10 bg-slate-50 rounded-full"></div>
                                        <div className="w-10 h-10 bg-slate-50 rounded-full"></div>
                                    </div>
                                </div>
                            ))
                        ) : facultyMembers.length > 0 ? (
                            facultyMembers.map((member, idx) => (
                                <div key={member.id} className="premium-card group relative flex flex-col items-center p-0 bg-white overflow-hidden border border-slate-100 h-full">
                                    <div className="w-full h-72 relative overflow-hidden bg-emerald-50">
                                        {member.image_path ? (
                                            <img
                                                src={member.image_path.startsWith('http') ? member.image_path : `http://127.0.0.1:8000/${member.image_path}`}
                                                alt={member.name}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${member.name.replace(' ', '+')}&background=${idx % 2 === 0 ? '064e3b' : 'ea580c'}&color=fff&size=400`}
                                                alt={member.name}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 justify-center">
                                            <div className="flex gap-4">
                                                {member.email && (
                                                    <a href={`mailto:${member.email}`} className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-[#064e3b] transition-all">
                                                        <Mail size={18} />
                                                    </a>
                                                )}
                                                {member.phone && (
                                                    <a href={`tel:${member.phone}`} className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-orange-500 hover:text-white transition-all">
                                                        <Phone size={18} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 text-center flex flex-col items-center w-full z-10 flex-grow">
                                        <h5 className="text-xl font-black text-slate-900 mb-1 group-hover:text-[#064e3b] transition-colors leading-tight">{member.name}</h5>
                                        <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-4 border border-emerald-100">{member.designation}</div>

                                        <div className="space-y-3 mt-auto text-left w-full border-t border-slate-50 pt-6">
                                            <div className="flex items-start gap-3">
                                                <GraduationCap size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                                                <p className="text-[11px] font-bold text-slate-500 leading-tight">{member.qualification || 'N/A'}</p>
                                            </div>
                                            {member.specialization && (
                                                <div className="flex items-start gap-3">
                                                    <BookOpen size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                                                    <p className="text-[11px] font-bold text-slate-500 leading-tight">{member.specialization}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center text-slate-400">
                                <UserCircle size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="font-bold">{t.faculty.noMembers}</p>
                            </div>
                        )}
                    </div>

                    <div className="text-center mt-20">
                        <a href="/" className="inline-flex items-center gap-3 bg-white border-2 border-[#064e3b] text-[#064e3b] px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#064e3b] hover:text-white transition-all shadow-xl group">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            {t.about.back}
                        </a>
                    </div>
                </div>
            </main>


        </div>
    );
};

export default FacultyPage;
