'use client';

import React, { useState, useEffect } from 'react';
import {
    Infinity as InfinityIcon,
    Globe,
    MapPin,
    Phone,
    ArrowRight,
    ChevronRight,
    ChevronLeft,
    Send,
    ArrowLeft,
    FileText,
    Search,
    Calendar,
    Download
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const NoticeBoard = () => {
    const { lang, setLang, t } = useLanguage();

    const [searchTerm, setSearchTerm] = useState('');

    // Fetch notices from API
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter state
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/notices')
            .then(res => res.json())
            .then(data => {
                setNotices(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch notices:', err);
                setLoading(false);
            });
    }, []);



    const filteredNotices = notices.filter(notice => {
        const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || notice.category === filterCategory;
        const matchesDate = !filterDate || (notice.published_at || notice.created_at || '').startsWith(filterDate);
        return matchesSearch && matchesCategory && matchesDate;
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
    const paginatedNotices = filteredNotices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterCategory, filterDate]);

    return (
        <div className={`min-h-screen bg-slate-50 selection:bg-orange-100 selection:text-green-900 ${lang === 'en' ? 'font-en' : 'font-bn'}`}>



            <main className="pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Page Header */}
                    <div className="text-center mb-16 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
                        <h1 className="text-4xl md:text-6xl font-black text-[#064e3b] uppercase tracking-tighter mb-4 heading-institutional">
                            {t.noticeBoard.title}
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg text-slate-600 font-medium leading-relaxed">
                            {t.noticeBoard.subtitle}
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-8 flex justify-center">
                        <div className="relative w-full max-w-lg">
                            <input
                                type="text"
                                placeholder={t.noticeBoard.searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-6 py-4 outline-none focus:border-orange-500 shadow-sm transition-all text-slate-700 font-bold"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mb-12 flex flex-wrap justify-center gap-4">
                        <div className="flex items-center gap-2 bg-white border-2 border-slate-200 rounded-xl px-4 py-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">{t.notices.categoryLabel}</label>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="bg-transparent text-sm font-bold text-slate-700 outline-none"
                            >
                                <option value="All">{t.notices.cats.All}</option>
                                <option value="HSC">{t.notices.cats.HSC}</option>
                                <option value="Honours">{t.notices.cats.Honours}</option>
                                <option value="Masters">{t.notices.cats.Masters}</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 bg-white border-2 border-slate-200 rounded-xl px-4 py-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">{t.notices.dateLabel}</label>
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="bg-transparent text-sm font-bold text-slate-700 outline-none"
                            />
                        </div>
                        {(filterCategory !== 'All' || filterDate) && (
                            <button
                                onClick={() => { setFilterCategory('All'); setFilterDate(''); }}
                                className="text-xs font-bold text-orange-500 hover:text-orange-600 underline px-4 py-2"
                            >
                                {t.notices.clearFilters}
                            </button>
                        )}
                    </div>

                    {/* Notice List */}
                    <div className="space-y-4">
                        {paginatedNotices.length > 0 ? (
                            paginatedNotices.map((notice) => (
                                <div key={notice.id} className="premium-card p-6 flex flex-col md:flex-row items-start md:items-center gap-6 group hover:border-[#064e3b] transition-all bg-white relative overflow-hidden">
                                    {/* Date Badge */}
                                    <div className="flex flex-col items-center justify-center bg-emerald-50 text-[#064e3b] border-2 border-emerald-100 rounded-xl p-3 min-w-[80px] shrink-0">
                                        <span className="text-2xl font-black leading-none">{new Date(notice.published_at || notice.created_at).toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric' })}</span>
                                        <span className="text-[10px] uppercase font-black tracking-wider">{new Date(notice.published_at || notice.created_at).toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US', { month: 'short' })}</span>
                                        <span className="text-[10px] font-bold opacity-60">{new Date(notice.published_at || notice.created_at).toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US', { year: 'numeric' }).replace(/,/g, '')}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-black text-slate-800 group-hover:text-[#064e3b] transition-colors leading-tight">
                                                {notice.title}
                                            </h3>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${notice.category === 'HSC' ? 'bg-blue-100 text-blue-600' :
                                                notice.category === 'Honours' ? 'bg-green-100 text-green-600' :
                                                    'bg-purple-100 text-purple-600'
                                                }`}>
                                                {t.notices.cats[notice.category] || notice.category}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-2 line-clamp-2">{notice.description}</p>
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            <FileText size={14} /> {t.notices.officialdNotice}
                                        </div>
                                    </div>

                                    {/* Action */}
                                    {notice.file_path && (
                                        <a
                                            href={`http://127.0.0.1:8000/${notice.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-[#064e3b] text-white px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition-all shrink-0"
                                        >
                                            <Download size={16} />
                                            <span className="hidden md:inline">{t.noticeBoard.download}</span>
                                        </a>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 text-slate-400">
                                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="font-bold">{t.noticeBoard.noNotices}</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-12">
                            <button
                                onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:border-orange-500 hover:text-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={18} /> {t.notices.prev}
                            </button>
                            <div className="flex items-center gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => { setCurrentPage(page); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === page
                                            ? 'bg-[#064e3b] text-white'
                                            : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-orange-500'
                                            }`}
                                    >
                                        {lang === 'bn' ? page.toLocaleString('bn-BD') : page}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:border-orange-500 hover:text-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {t.notices.next} <ChevronRight size={18} />
                            </button>
                        </div>
                    )}

                    {/* Back Button */}
                    <div className="text-center mt-16">
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

export default NoticeBoard;
