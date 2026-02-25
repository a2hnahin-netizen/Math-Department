'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function AvailableBooksPage() {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/books/available')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setBooks(data);
            })
            .catch(err => console.error(err));
    }, []);

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <Link href="/resources" className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-500 font-bold mb-8 transition-colors">
                    <ChevronLeft size={20} /> Back to Resources
                </Link>

                <div className="bg-white rounded-[2rem] p-10 md:p-16 shadow-xl border border-slate-100">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase tracking-widest rounded-full mb-6 border border-emerald-200">
                            Seminar Library
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black text-[#064e3b] uppercase tracking-tighter mb-6">
                            Available Books
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg text-slate-600 font-medium leading-relaxed">
                            Browse the collection of books currently available for borrowing in our seminar library.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="max-w-md mx-auto mb-12 relative">
                        <input
                            type="text"
                            placeholder="Search by title or author..."
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 outline-none focus:border-orange-500 transition-all shadow-inner"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    </div>

                    {/* Books Grid */}
                    {filteredBooks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredBooks.map((book, idx) => (
                                <div key={idx} className="p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-lg transition-all group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                                            <BookOpen size={24} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                            {book.accession_number}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800 mb-1 leading-tight group-hover:text-[#064e3b] transition-colors">{book.title}</h3>
                                    <p className="text-sm font-bold text-slate-500">{book.author}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <Search size={32} />
                            </div>
                            <p className="text-slate-500 font-bold">No books found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
