'use client';

import React, { useState } from 'react';
import AdminDashboard from "@/components/AdminDashboard";
import { Lock, User, ArrowRight } from 'lucide-react';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Mock login delay
        setTimeout(() => {
            if (username === 'admin' && password === 'admin') {
                setIsAuthenticated(true);
            } else {
                setError('Invalid credentials');
            }
            setLoading(false);
        }, 800);
    };

    if (isAuthenticated) {
        return <AdminDashboard />;
    }

    return (
        <div className="min-h-screen bg-[#042f24] flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                <div className="bg-orange-500 p-8 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto flex items-center justify-center text-white mb-4 backdrop-blur-sm">
                        <Lock size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider">Admin Portal</h2>
                    <p className="text-orange-100 text-xs font-bold uppercase tracking-widest mt-2">Secure Access Only</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Username</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 pl-12 text-slate-800 font-bold focus:border-[#042f24] focus:bg-white outline-none transition-all"
                                    placeholder="Enter username"
                                />
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 pl-12 text-slate-800 font-bold focus:border-[#042f24] focus:bg-white outline-none transition-all"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg text-center animate-pulse">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#042f24] text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-emerald-900 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                        >
                            {loading ? 'Verifying...' : 'Access Dashboard'}
                            {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-8">
                        Restricted Area • Authorized Personnel Only
                    </p>
                </div>
            </div>
        </div>
    );
}
