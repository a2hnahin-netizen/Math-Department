'use client';

import React, { useState, useEffect } from 'react';
import {
    Infinity as InfinityIcon,
    Globe,
    Megaphone,
    CalendarDays,
    Presentation,
    GraduationCap,
    Library,
    FileText,
    Search,
    Mail,
    MapPin,
    Phone,
    ArrowRight,
    ChevronRight,
    BookOpen,
    Award,
    ExternalLink,
    UserCircle,
    Link as LinkIcon,
    Send,
    Image as ImageIcon,
    ArrowLeft,
    Users
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

const LandingPage = () => {
    const { lang, setLang, t } = useLanguage();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [currentPage, setCurrentPage] = useState('home'); // Navigation state: 'home' or 'gallery'

    // Fetched Data State
    const [facultyMembers, setFacultyMembers] = useState([]);
    const [notices, setNotices] = useState([]);

    // Footer Query State
    const [queryName, setQueryName] = useState('');
    const [queryEmail, setQueryEmail] = useState('');
    const [queryMsg, setQueryMsg] = useState('');

    useEffect(() => {
        const fetchPublicData = async () => {
            try {
                // Fetch faculty from Supabase
                const { data: facultyData, error: facultyError } = await supabase
                    .from('faculty')
                    .select('*')
                    .eq('is_active', true)
                    .order('order', { ascending: true });
                if (!facultyError) setFacultyMembers(facultyData || []);

                // Fetch latest 2 notices from Supabase
                const { data: noticesData, error: noticesError } = await supabase
                    .from('notices')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(2);
                if (!noticesError) setNotices(noticesData || []);
            } catch (err) {
                console.error('Failed to fetch public data:', err);
            }
        };

        fetchPublicData();
    }, []);

    // Slideshow Logic
    const slides = [
        "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=2070&auto=format&fit=crop"
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // Scroll Animation Logic for Floating Menu



    // Consolidated Faculty List (using translation keys effectively requires looking up translated values if keys match, but here we just map directly)
    // Since content is in 't', we can use it.
    // (Moved to state above)

    // Dummy Gallery Data
    const galleryItems = [
        { id: 1, title: "Batch 2024 Farewell", url: "https://images.unsplash.com/photo-1523050853064-88981427505d?q=80&w=2070" },
        { id: 2, title: "Math Olympiad 2023", url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132" },
        { id: 3, title: "Honours 3rd Year Batch", url: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070" },
        { id: 4, title: "Departmental Seminar", url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070" },
        { id: 5, title: "Batch 2022 Reunion", url: "https://images.unsplash.com/photo-1525921429624-479b6a29d810?q=80&w=2070" },
        { id: 6, title: "Study Tour - 2023", url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070" }
    ];

    return (
        <div className={`min-h-screen bg-slate-50 selection:bg-orange-100 selection:text-green-900 ${lang === 'en' ? 'font-en' : 'font-bn'}`}>

            {/* Header removed - content moved to global Navbar */}

            <main className="pt-0">

                {currentPage === 'home' ? (
                    /* HOME PAGE VIEW */
                    <>
                        {/* HERO IMAGE SLIDESHOW */}
                        <section id="home" className="relative h-[400px] md:h-[600px] lg:h-[700px] overflow-hidden bg-black">
                            {slides.map((url, idx) => (
                                <div
                                    key={idx}
                                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center ${idx === currentSlide ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
                                    style={{ backgroundImage: `url(${url})` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
                                </div>
                            ))}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
                                {slides.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentSlide(idx)}
                                        className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-orange-500 w-10' : 'bg-white/50'}`}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* EXCELLENCE SECTION */}
                        <section className="bg-white py-12 md:py-20 px-6 text-center shadow-inner border-b">
                            <div className="max-w-4xl mx-auto">
                                <span className="inline-block px-4 py-1 bg-orange-500 text-white font-black text-[10px] md:text-xs uppercase tracking-widest rounded shadow-lg mb-6 transform -rotate-1">
                                    {t.estd}
                                </span>
                                <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-[#064e3b] leading-tight tracking-tighter mb-6">
                                    {t.hero.title.split(' ').map((word, i) => (
                                        <span key={i} className={i > 1 ? 'text-[#800000]' : ''}>{word} </span>
                                    ))}
                                </h2>
                                <p className="text-base md:text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed mb-10">
                                    {t.hero.sub}
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                    <button className="w-full sm:w-auto bg-[#064e3b] text-white px-10 py-4 rounded-xl font-black shadow-xl flex items-center justify-center gap-3 text-sm md:text-base hover:bg-[#042f24] transition-all">
                                        {t.hero.apply} <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* ABOUT SECTION */}
                        <section id="about" className="py-20 bg-slate-50 relative overflow-hidden text-center border-b border-slate-200">
                            <div className="max-w-4xl mx-auto px-6 relative z-10">
                                <h2 className="text-2xl md:text-4xl font-black text-[#064e3b] uppercase tracking-tighter heading-institutional mb-10">
                                    {t.nav.about} {t.dept}
                                </h2>
                                <div className="bg-white p-8 md:p-12 rounded-[2rem] border-2 border-dashed border-orange-200 shadow-sm">
                                    <p className="text-base md:text-xl text-slate-700 leading-relaxed font-medium">
                                        {t.landing.aboutText}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* NOTICE BOARD SECTION */}
                        <section id="notices" className="py-20 bg-white">
                            <div className="max-w-6xl mx-auto px-6 space-y-12">
                                <div className="premium-card overflow-hidden">
                                    <div className="bg-gradient-to-r from-[#064e3b] to-[#042f24] text-white p-6 flex items-center justify-between border-b-4 border-orange-500">
                                        <h3 className="font-black flex items-center gap-4 uppercase text-sm md:text-base tracking-widest">
                                            <Megaphone size={24} className="text-orange-400" />
                                            {t.notices.title}
                                        </h3>
                                        <a href="/notices" className="text-[10px] font-black uppercase border border-white/30 px-4 py-1 rounded-full hover:bg-white/10 transition-all">{t.notices.viewAll}</a>
                                    </div>
                                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                        {notices.map((notice, i) => (
                                            <div key={notice.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-orange-50 transition-all cursor-pointer group border border-transparent hover:border-orange-100">
                                                <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-800 flex flex-col items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                                    <span className="text-[10px] font-black uppercase">
                                                        {new Date(notice.published_at || notice.created_at).toLocaleString('default', { month: 'short' })}
                                                    </span>
                                                    <span className="text-lg font-black">
                                                        {new Date(notice.published_at || notice.created_at).getDate()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800 group-hover:text-orange-700 leading-snug">
                                                        {notice.title}
                                                    </h4>
                                                    <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">{t.landing.notices.academicSection}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {notices.length === 0 && (
                                            <p className="col-span-full text-center text-slate-400 font-bold py-4">{t.landing.notices.noNotices}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="premium-card overflow-hidden text-left border-t-4 border-emerald-600">
                                        <div className="bg-[#064e3b] text-white p-5 border-b-4 border-orange-500">
                                            <h3 className="font-black flex items-center gap-4 uppercase text-xs tracking-widest">
                                                <CalendarDays size={20} className="text-orange-400" />
                                                {t.notices.routine}
                                            </h3>
                                        </div>
                                        <div className="p-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                            {['HSC', 'Honours', 'Masters'].map(level => (
                                                <button key={level} className="w-full flex items-center p-5 bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl hover:bg-emerald-50 hover:border-[#064e3b] transition-all group shadow-sm">
                                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#064e3b] mr-5 border"><FileText size={24} /></div>
                                                    <span className="text-sm font-black text-green-900 uppercase tracking-widest">{level} {t.landing.routine}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="premium-card overflow-hidden text-left border-t-4 border-orange-500">
                                        <div className="bg-orange-600 text-white p-5 border-b-4 border-orange-800">
                                            <h3 className="font-black flex items-center gap-4 uppercase text-xs tracking-widest">
                                                <Presentation size={20} />
                                                {t.notices.lesson}
                                            </h3>
                                        </div>
                                        <div className="p-10">
                                            <div className="bg-orange-50 border-l-8 border-orange-500 p-8 rounded-r-[2rem] shadow-inner">
                                                <h5 className="text-[12px] font-black text-orange-800 uppercase mb-3 tracking-[0.2em] underline underline-offset-4">{t.landing.lesson.updateTitle}</h5>
                                                <p className="text-lg text-yellow-950 font-bold leading-relaxed italic">
                                                    {t.landing.lesson.updateText}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* PHOTO SECTION */}
                                <div className="premium-card overflow-hidden bg-white border-t-4 border-[#064e3b]">
                                    <div className="p-6 flex items-center justify-between border-b border-slate-100">
                                        <div>
                                            <h3 className="text-xl font-black text-[#064e3b] uppercase tracking-tighter flex items-center gap-3">
                                                <ImageIcon size={24} className="text-orange-500" />
                                                {t.gallery.title}
                                            </h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.gallery.subtitle}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setCurrentPage('gallery');
                                                window.scrollTo(0, 0);
                                            }}
                                            className="bg-[#064e3b] text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg"
                                        >
                                            {t.gallery.seeAll} <ArrowRight size={14} />
                                        </button>
                                    </div>
                                    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {galleryItems.slice(0, 4).map(img => (
                                            <div key={img.id} className="gallery-zoom relative h-40 md:h-56 rounded-2xl bg-slate-100 border border-slate-200 shadow-sm cursor-pointer group">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end">
                                                    <p className="text-white text-[10px] font-black uppercase tracking-tight">{img.title}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* FACULTY MEMBERS SECTION - CENTERED */}
                        <section id="faculty" className="py-24 bg-slate-50 border-t border-slate-200">
                            <div className="max-w-7xl mx-auto px-6">
                                <div className="text-center mb-16">
                                    <h2 className="text-2xl md:text-4xl font-black text-[#064e3b] uppercase tracking-tighter heading-institutional mb-20">
                                        {t.faculty.title}
                                    </h2>
                                    <div className="flex flex-wrap justify-center gap-10">
                                        {facultyMembers.map((teacher, idx) => (
                                            <div key={idx} className="premium-card group relative flex flex-col items-center p-0 w-full sm:w-[calc(50%-20px)] lg:w-[calc(33.33%-27px)] max-w-sm overflow-hidden bg-white">
                                                <div className="w-full h-64 relative overflow-hidden bg-slate-100">
                                                    {teacher.image_path ? (
                                                        <img src={teacher.image_path.startsWith('http') ? teacher.image_path : `http://127.0.0.1:8000/${teacher.image_path}`} alt={teacher.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                                    ) : (
                                                        <img src={`https://ui-avatars.com/api/?name=${teacher.name.replace(' ', '+')}&background=${idx % 2 === 0 ? '064e3b' : 'ea580c'}&color=fff&size=400`} alt={teacher.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 justify-center">
                                                        <div className="flex gap-4">
                                                            {teacher.email && (
                                                                <a href={`mailto:${teacher.email}`} className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-[#064e3b] transition-all">
                                                                    <Mail size={18} />
                                                                </a>
                                                            )}
                                                            {teacher.phone && (
                                                                <a href={`tel:${teacher.phone}`} className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-orange-500 hover:text-white transition-all">
                                                                    <Phone size={18} />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-center p-8 text-center w-full">
                                                    <h5 className="text-xl font-black text-slate-900 mb-2 group-hover:text-[#064e3b] leading-tight">{teacher.name}</h5>
                                                    <div className="px-4 py-1.5 rounded-full bg-[#064e3b]/5 text-[#064e3b] text-[11px] font-black uppercase tracking-widest mb-8">{teacher.designation}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ACADEMIC PROGRAMS SECTION */}
                        <section id="programs" className="bg-[#042f24] py-20 px-6 text-center text-white">
                            <div className="max-w-7xl mx-auto">
                                <h2 className="text-2xl md:text-4xl font-black text-orange-400 mb-16 uppercase tracking-widest heading-institutional">
                                    {t.nav.programs}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                                    {[
                                        { title: t.resources.hsc, icon: GraduationCap, color: 'bg-white text-[#064e3b]', desc: t.landing.programs.foundation },
                                        { title: t.resources.grad, icon: BookOpen, color: 'bg-[#064e3b] text-white border border-white/10', desc: t.landing.programs.undergraduate },
                                        { title: t.resources.pgrad, icon: Award, color: 'bg-orange-500 text-white', desc: t.landing.programs.research }
                                    ].map((prog, idx) => (
                                        <div key={idx} className={`p-10 rounded-[2.5rem] shadow-2xl flex flex-col group hover:-translate-y-2 transition-all ${prog.color}`}>
                                            <span className="text-[10px] font-black tracking-[0.3em] mb-4 opacity-60 uppercase">{prog.desc}</span>
                                            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-8 bg-current/5"><prog.icon size={40} /></div>
                                            <h4 className="text-xl font-black uppercase tracking-tight mb-8 leading-tight">{prog.title}</h4>
                                            <button className="mt-auto px-8 py-3 border-2 border-current rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-current hover:text-white transition-all">{t.landing.programs.details}</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>


                    </>
                ) : (
                    /* BATCH GALLERY PAGE */
                    <div className="bg-slate-50 min-h-screen pt-40 pb-20 px-6">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-slate-200 pb-8 text-center md:text-left">
                                <div>
                                    <h2 className="text-3xl md:text-5xl font-black text-[#064e3b] uppercase tracking-tighter">{t.gallery.batchGalleryTitle}</h2>
                                    <p className="text-orange-600 font-bold uppercase tracking-[0.2em] text-xs mt-2">{t.landing.gallery.batchSubtitle}</p>
                                </div>
                                <button
                                    onClick={() => setCurrentPage('home')}
                                    className="flex items-center gap-3 bg-white border-2 border-[#064e3b] text-[#064e3b] px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-emerald-50 transition-all shadow-md group"
                                >
                                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                    {t.gallery.back}
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {galleryItems.map(item => (
                                    <div key={item.id} className="premium-card group overflow-hidden bg-white">
                                        <div className="relative h-64 overflow-hidden"><img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /></div>
                                        <div className="p-6 flex items-center justify-between">
                                            <div>
                                                <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{item.title}</h4>
                                                <div className="flex items-center gap-2 mt-2"><Users size={14} className="text-slate-400" /><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.landing.gallery.milestone}</span></div>
                                            </div>
                                            <button className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#064e3b] hover:bg-[#064e3b] hover:text-white transition-all"><ExternalLink size={18} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer removed: handled globally in layout */}
        </div>
    );
};

export default LandingPage;
