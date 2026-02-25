'use client';

import React, { useState } from 'react';
import {
    Infinity as InfinityIcon,
    Globe,
    MapPin,
    Phone,
    ChevronRight,
    Send
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

const Footer = () => {
    const { t } = useLanguage();

    // Footer Query State
    const [queryName, setQueryName] = useState('');
    const [queryEmail, setQueryEmail] = useState('');
    const [queryMsg, setQueryMsg] = useState('');

    const handleQuerySubmit = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('contact_messages')
                .insert([{
                    name: queryName,
                    email: queryEmail,
                    message: queryMsg,
                    is_read: false
                }]);

            if (!error) {
                alert('Message sent successfully!');
                setQueryName('');
                setQueryEmail('');
                setQueryMsg('');
            } else {
                throw error;
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('An error occurred: ' + error.message);
        }
    };

    return (
        <footer id="contact" className={`bg-[#042f24] text-white pt-20 pb-12 border-t-[12px] border-orange-500 ${useLanguage().lang === 'bn' ? 'font-bn' : 'font-en'}`}>
            <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20 text-center sm:text-left">
                <div className="flex flex-col items-center sm:items-start">
                    <div className="bg-white p-4 rounded-2xl shadow-2xl mb-8 transform -rotate-2 hover:rotate-0 transition-all cursor-pointer">
                        <a href="/" className="flex items-center gap-5 text-[#064e3b]">
                            <InfinityIcon size={40} strokeWidth={3} />
                            <div className="border-l-2 border-slate-100 pl-4">
                                <h2 className="text-xl font-black uppercase leading-none tracking-tighter">{t.footer.portalTitle}</h2>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] mt-1 text-slate-500">{t.footer.collegeSubtitle}</p>
                            </div>
                        </a>
                    </div>
                    <p className="text-emerald-100/70 max-w-sm text-sm leading-relaxed font-bold italic mb-8">{t.footer.mission}</p>
                    <h5 className="text-[11px] font-black text-orange-400 uppercase tracking-[0.4em] mb-6">{t.footer.addressTitle}</h5>
                    <ul className="space-y-4 text-emerald-100/70 text-xs font-bold">
                        <li className="flex items-start justify-center sm:justify-start gap-4"><MapPin size={20} className="text-orange-500 shrink-0" /><span>{t.contact?.address || "College Road, Chawkbazar,"}<br />{t.contact?.city || "Chattogram, 4203"}</span></li>
                        <li className="flex items-center justify-center sm:justify-start gap-4"><Phone size={20} className="text-orange-500 shrink-0" /><span>+88 031 614234</span></li>
                    </ul>
                </div>
                <div>
                    <h5 className="text-[11px] font-black text-orange-400 uppercase tracking-[0.4em] mb-10">{t.footer.navTitle}</h5>
                    <ul className="space-y-4 text-emerald-100/70 text-xs font-black uppercase tracking-[0.2em]">
                        {['home', 'about', 'faculty'].map(key => (
                            <li key={key}>
                                <a href={key === 'home' ? '/' : `/${key}`} className="hover:text-yellow-400 flex items-center gap-3 justify-center sm:justify-start transition-all">
                                    <ChevronRight size={16} strokeWidth={3} className="text-orange-500" /> {t.nav[key]}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h5 className="text-[11px] font-black text-orange-400 uppercase tracking-[0.4em] mb-10">{t.footer.linksTitle}</h5>
                    <ul className="space-y-4 text-emerald-100/70 text-[11px] font-black uppercase tracking-[0.1em]">
                        {t.footer.institutionalLinks.map((link, idx) => (
                            <li key={idx}><a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 flex items-center gap-3 transition-colors group"><ChevronRight size={14} className="text-orange-500 group-hover:translate-x-1 transition-transform" />{link.name}</a></li>
                        ))}
                    </ul>
                </div>
                <div className="bg-black/20 p-8 rounded-3xl border border-white/5 shadow-inner">
                    <h5 className="text-[11px] font-black text-orange-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-3"><Send size={16} className="text-orange-500" /> {t.footer.queryTitle}</h5>
                    <form className="space-y-4" onSubmit={handleQuerySubmit}>
                        <input type="text" placeholder={t.footer.queryPlaceholderName} className="query-input" value={queryName || ''} onChange={(e) => setQueryName(e.target.value)} required />
                        <input type="email" placeholder={t.footer.queryPlaceholderEmail} className="query-input" value={queryEmail || ''} onChange={(e) => setQueryEmail(e.target.value)} required />
                        <textarea rows="3" placeholder={t.footer.queryPlaceholderMsg} className="query-input resize-none" value={queryMsg || ''} onChange={(e) => setQueryMsg(e.target.value)} required></textarea>
                        <button type="submit" className="w-full bg-orange-500 text-white font-black py-3 rounded-xl hover:bg-orange-600 transition-all uppercase tracking-widest text-[10px] shadow-lg flex items-center justify-center gap-2">{t.footer.queryBtn} <Send size={12} /></button>
                    </form>
                </div>
            </div>
            <div className="max-w-[1600px] mx-auto px-6 border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                <p className="text-[10px] text-orange-400/60 uppercase tracking-[0.6em] font-black">{t.footer.copyright}</p>
                <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-orange-500 hover:text-black transition-all cursor-pointer shadow-lg text-white"><InfinityIcon size={20} /></div>
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-orange-500 hover:text-black transition-all cursor-pointer shadow-lg text-white"><Globe size={20} /></div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
