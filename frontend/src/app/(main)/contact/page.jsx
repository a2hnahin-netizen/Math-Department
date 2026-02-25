'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactPage() {
    const { t, lang } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Thank you for your message. We will get back to you shortly.");
        // Internal API call would go here
    };

    const contactInfo = [
        {
            icon: MapPin,
            title: "Department Address",
            details: ["Govt. Hazi Muhammad Mohsin College", "College Road, Chawkbazar, Chattogram-4203"]
        },
        {
            icon: Phone,
            title: "Phone & Fax",
            details: ["+88 031 614234", "+88 018 12345678"]
        },
        {
            icon: Mail,
            title: "Email Support",
            details: ["math@mohsincollege.edu.bd", "info@mathdept.com"]
        },
        {
            icon: Clock,
            title: "Office Hours",
            details: ["Sunday - Thursday: 09:00 AM - 04:00 PM", "Friday & Saturday: Closed"]
        }
    ];

    return (
        <div className={`min-h-screen bg-slate-50 pt-32 pb-20 px-6 ${lang === 'en' ? 'font-en' : 'font-bn'}`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 relative">
                    <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-800 font-black text-[10px] uppercase tracking-widest rounded-full mb-6 border border-orange-200">
                        Get in Touch
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-[#064e3b] uppercase tracking-tighter mb-6 heading-institutional">
                        {t.nav?.contact || "Contact Us"}
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                        Have questions about admissions, academic programs, or research? We're here to help. Reach out to us directly.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">

                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {contactInfo.map((item, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#064e3b] mb-4 group-hover:bg-[#064e3b] group-hover:text-white transition-colors">
                                    <item.icon size={24} />
                                </div>
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">{item.title}</h3>
                                <div className="space-y-1">
                                    {item.details.map((line, i) => (
                                        <p key={i} className="text-sm text-slate-500 font-bold">{line}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#042f24] p-10 md:p-14 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-8 flex items-center gap-4 relative z-10">
                                <MessageSquare size={28} className="text-orange-500" /> Send a Message
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-200 ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:border-orange-500 focus:bg-white/10 outline-none transition-all font-bold"
                                            placeholder="Your Name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-200 ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:border-orange-500 focus:bg-white/10 outline-none transition-all font-bold"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-200 ml-1">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:border-orange-500 focus:bg-white/10 outline-none transition-all font-bold"
                                        placeholder="Inquiry Topic"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-200 ml-1">Message</label>
                                    <textarea
                                        name="message"
                                        rows="4"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:border-orange-500 focus:bg-white/10 outline-none transition-all font-bold resize-none"
                                        placeholder="How can we help you?"
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-xl uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-3 text-sm mt-4">
                                    Send Message <Send size={16} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="w-full h-96 rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-200 relative group">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3689.856402446656!2d91.82904731495673!3d22.352662985296417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30acd884074251cb%3A0x6e969968940562e2!2sGovt.%20Hazi%20Muhammad%20Mohsin%20College!5e0!3m2!1sen!2sbd!4v1644754593853!5m2!1sen!2sbd"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        className="grayscale group-hover:grayscale-0 transition-all duration-700"
                    ></iframe>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                        Chawkbazar, Chittagong
                    </div>
                </div>

            </div>
        </div>
    );
}
