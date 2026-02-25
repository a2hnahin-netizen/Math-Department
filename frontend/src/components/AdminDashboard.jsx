'use client';

import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    Megaphone,
    Image as ImageIcon,
    Settings,
    LogOut,
    Menu,
    Bell,
    FileText,
    BookOpen,
    Library,
    Upload,
    Trash2,
    GraduationCap,
    UserCircle,
    ChevronLeft,
    ChevronRight,
    Mail
} from 'lucide-react';
import { uploadImageToImgBB } from '../utils/imgbb';
import { supabase } from '../lib/supabase';

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');

    // Messages State
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Mock Data
    const [stats, setStats] = useState({
        totalStudents: 1250,
        totalFaculty: 18,
        activeNotices: 5,
        pendingRequests: 12
    });

    const [newNotice, setNewNotice] = useState({ title: '', category: 'Honours', description: '', file: null });
    const [notices, setNotices] = useState([]);

    const [newFaculty, setNewFaculty] = useState({
        name: '',
        designation: '',
        qualification: '',
        specialization: '',
        email: '',
        phone: '',
        image: null,
        order: '0', // Using string for initial state to satisfy controlled inputs better
        is_active: true
    });
    const [facultyMembers, setFacultyMembers] = useState([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter state
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterDate, setFilterDate] = useState('');

    // Apply filters
    const filteredNotices = notices.filter(notice => {
        const matchesCategory = filterCategory === 'All' || notice.category === filterCategory;
        const matchesDate = !filterDate || (notice.published_at || notice.created_at || '').startsWith(filterDate);
        return matchesCategory && matchesDate;
    });

    const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
    const paginatedNotices = filteredNotices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch notices
            const { data: noticesData, error: noticesError } = await supabase
                .from('notices')
                .select('*')
                .order('created_at', { ascending: false });
            if (!noticesError) setNotices(noticesData || []);

            // Fetch faculty
            const { data: facultyData, error: facultyError } = await supabase
                .from('faculty')
                .select('*')
                .order('order', { ascending: true });
            if (!facultyError) setFacultyMembers(facultyData || []);
        };

        fetchData();
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setNewNotice({ ...newNotice, file: e.target.files[0] });
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        try {
            let file_path = null;
            if (newNotice.file) {
                const fileExt = newNotice.file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('notices')
                    .upload(fileName, newNotice.file);

                if (uploadError) throw uploadError;
                const { data: { publicUrl } } = supabase.storage
                    .from('notices')
                    .getPublicUrl(fileName);
                file_path = publicUrl;
            }

            const { data, error } = await supabase
                .from('notices')
                .insert([{
                    title: newNotice.title,
                    category: newNotice.category,
                    description: newNotice.description,
                    file_path: file_path
                }])
                .select();

            if (data) {
                setNotices([data[0], ...notices]);
                setNewNotice({ title: '', category: 'Honours', description: '', file: null });
                alert('Notice uploaded successfully!');
            }
            if (error) throw error;
        } catch (error) {
            console.error('Error uploading notice:', error);
            alert('Error uploading notice: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this notice?')) return;
        const { error } = await supabase
            .from('notices')
            .delete()
            .eq('id', id);

        if (!error) {
            setNotices(notices.filter(n => n.id !== id));
        } else {
            alert('Error deleting notice: ' + error.message);
        }
    };

    const handleFacultyUpload = async (e) => {
        e.preventDefault();

        try {
            let image_path = null;
            if (newFaculty.image) {
                try {
                    image_path = await uploadImageToImgBB(newFaculty.image);
                } catch (error) {
                    console.error('ImgBB Upload Failed:', error);
                    alert('Failed to upload image. Please try again.');
                    return;
                }
            }

            const { data, error } = await supabase
                .from('faculty')
                .insert([{
                    name: newFaculty.name,
                    designation: newFaculty.designation,
                    qualification: newFaculty.qualification,
                    specialization: newFaculty.specialization,
                    email: newFaculty.email,
                    phone: newFaculty.phone,
                    image_path: image_path,
                    order: parseInt(newFaculty.order) || 0,
                    is_active: newFaculty.is_active
                }])
                .select();

            if (data) {
                setFacultyMembers([...facultyMembers, data[0]]);
                setNewFaculty({
                    name: '', designation: '', qualification: '', specialization: '',
                    email: '', phone: '', image: null, order: '0', is_active: true
                });
                alert('Faculty member added successfully!');
            }
            if (error) throw error;
        } catch (error) {
            console.error('Error adding faculty:', error);
            alert(`Error adding faculty: ${error.message}`);
        }
    };

    const handleFacultyDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this faculty member?')) return;
        const { error } = await supabase
            .from('faculty')
            .delete()
            .eq('id', id);

        if (!error) {
            setFacultyMembers(facultyMembers.filter(f => f.id !== id));
        } else {
            alert('Failed to delete faculty member: ' + error.message);
        }
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'messages', label: 'Messages', icon: Mail, badge: unreadCount },
        { id: 'faculty', label: 'Manage Faculty', icon: Users },
        { id: 'notices', label: 'Manage Notices', icon: Megaphone },
        { id: 'resources', label: 'Manage Resources', icon: BookOpen },
        { id: 'library', label: 'Seminar Library', icon: Library },
        { id: 'gallery', label: 'Gallery', icon: ImageIcon },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const [resources, setResources] = useState([]);
    const [newResource, setNewResource] = useState({ title: '', category: 'Syllabus', description: '', file: null });

    useEffect(() => {
        const fetchResources = async () => {
            const { data, error } = await supabase
                .from('resources')
                .select('*')
                .order('created_at', { ascending: false });
            if (!error) setResources(data || []);
        };
        fetchResources();
    }, []);

    const handleResourceUpload = async (e) => {
        e.preventDefault();
        try {
            let file_path = null;
            if (newResource.file) {
                const fileExt = newResource.file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('resources')
                    .upload(fileName, newResource.file);

                if (uploadError) throw uploadError;
                const { data: { publicUrl } } = supabase.storage
                    .from('resources')
                    .getPublicUrl(fileName);
                file_path = publicUrl;
            }

            const { data, error } = await supabase
                .from('resources')
                .insert([{
                    title: newResource.title,
                    category: newResource.category,
                    description: newResource.description,
                    file_path: file_path
                }])
                .select();

            if (data) {
                setResources([data[0], ...resources]);
                setNewResource({ title: '', category: 'Syllabus', description: '', file: null });
                alert('Resource uploaded!');
            }
            if (error) throw error;
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const handleResourceDelete = async (id) => {
        if (!confirm('Delete resource?')) return;
        const { error } = await supabase
            .from('resources')
            .delete()
            .eq('id', id);
        if (!error) setResources(resources.filter(r => r.id !== id));
    };

    useEffect(() => {
        fetchUnreadCount();
        if (activeTab === 'messages') {
            fetchMessages();
        }
    }, [activeTab]);

    const fetchUnreadCount = async () => {
        const { count, error } = await supabase
            .from('contact_messages')
            .select('*', { count: 'exact', head: true })
            .eq('is_read', false);
        if (!error) setUnreadCount(count);
    };

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error) setMessages(data || []);
    };

    const handleMarkRead = async (id) => {
        const { error } = await supabase
            .from('contact_messages')
            .update({ is_read: true })
            .eq('id', id);
        if (!error) {
            setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
            fetchUnreadCount();
        }
    };

    const handleDeleteMessage = async (id) => {
        if (!confirm('Delete this message?')) return;
        const { error } = await supabase
            .from('contact_messages')
            .delete()
            .eq('id', id);
        if (!error) {
            setMessages(messages.filter(m => m.id !== id));
            fetchUnreadCount();
        }
    };

    // Library State & Handlers
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({ title: '', author: '', accession_number: '', quantity: 1 });
    const [showLendModal, setShowLendModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [borrower, setBorrower] = useState({ borrower_name: '', borrower_roll: '', borrower_session: '', borrower_program: '', borrower_phone: '' });

    useEffect(() => {
        if (activeTab === 'library') {
            fetchBooks();
        }
    }, [activeTab]);

    const fetchBooks = async () => {
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .order('title', { ascending: true });
        if (!error) setBooks(data || []);
    };

    const handleBookUpload = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from('books')
            .insert([newBook])
            .select();

        if (data) {
            fetchBooks();
            setNewBook({ title: '', author: '', accession_number: '', quantity: 1 });
            alert('Book added!');
        } else {
            alert('Failed to add book: ' + error.message);
        }
    };

    const handleLendSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase
            .from('books')
            .update({
                ...borrower,
                is_available: false,
                borrowed_at: new Date().toISOString()
            })
            .eq('id', selectedBook.id);

        if (!error) {
            fetchBooks();
            setShowLendModal(false);
            setBorrower({ borrower_name: '', borrower_roll: '', borrower_session: '', borrower_program: '', borrower_phone: '' });
            alert('Book lent successfully!');
        } else {
            alert('Error: ' + error.message);
        }
    };

    const handleReturnBook = async (id) => {
        if (!confirm('Confirm return?')) return;
        const { error } = await supabase
            .from('books')
            .update({
                is_available: true,
                borrower_name: null,
                borrower_roll: null,
                borrower_session: null,
                borrower_program: null,
                borrower_phone: null,
                borrowed_at: null
            })
            .eq('id', id);

        if (!error) {
            fetchBooks();
            alert('Book returned!');
        }
    };

    const handleBookDelete = async (id) => {
        if (!confirm('Delete book?')) return;
        const { error } = await supabase
            .from('books')
            .delete()
            .eq('id', id);
        if (!error) setBooks(books.filter(b => b.id !== id));
    };

    // Gallery State & Handlers
    const [gallery, setGallery] = useState([]);
    const [newGallery, setNewGallery] = useState({ title: '', image: null });

    useEffect(() => {
        if (activeTab === 'gallery') {
            fetchGallery();
        }
    }, [activeTab]);

    const fetchGallery = async () => {
        const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error) setGallery(data || []);
    };

    const handleGalleryUpload = async (e) => {
        e.preventDefault();
        try {
            if (!newGallery.image) return;
            const imageUrl = await uploadImageToImgBB(newGallery.image);

            const { data, error } = await supabase
                .from('gallery')
                .insert([{ title: newGallery.title, url: imageUrl }])
                .select();

            if (data) {
                setGallery([data[0], ...gallery]);
                setNewGallery({ title: '', image: null });
                alert('Gallery item added!');
            } else {
                throw error;
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const handleGalleryDelete = async (id) => {
        if (!confirm('Delete this item?')) return;
        const { error } = await supabase
            .from('gallery')
            .delete()
            .eq('id', id);
        if (!error) setGallery(gallery.filter(item => item.id !== id));
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[
                            { label: 'Total Students', val: stats.totalStudents, icon: Users, color: 'bg-blue-500' },
                            { label: 'Faculty Members', val: stats.totalFaculty, icon: BookOpen, color: 'bg-green-500' },
                            { label: 'Active Notices', val: stats.activeNotices, icon: Bell, color: 'bg-orange-500' },
                            { label: 'Pending Requests', val: stats.pendingRequests, icon: FileText, color: 'bg-purple-500' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800">{stat.val}</h3>
                                    <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'messages':
                return (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                            <Mail size={24} className="text-orange-500" /> Inbox ({messages.length})
                        </h3>
                        <div className="space-y-4">
                            {messages.map(msg => (
                                <div key={msg.id} className={`p-6 rounded-xl border transition-all ${msg.is_read ? 'bg-slate-50 border-slate-100' : 'bg-orange-50/50 border-orange-100 shadow-sm'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${msg.is_read ? 'bg-slate-200 text-slate-500' : 'bg-orange-500 text-white'}`}>
                                                {msg.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{msg.name}</h4>
                                                <p className="text-xs text-slate-500 font-medium">{msg.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(msg.created_at).toLocaleString()}</span>
                                            <button onClick={() => handleDeleteMessage(msg.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-700 font-medium leading-relaxed mb-4">{msg.message}</p>
                                    {!msg.is_read && (
                                        <button onClick={() => handleMarkRead(msg.id)} className="text-xs font-black uppercase text-orange-600 hover:text-orange-800 tracking-widest flex items-center gap-1">
                                            Mark as Read
                                        </button>
                                    )}
                                </div>
                            ))}
                            {messages.length === 0 && <p className="text-center text-slate-400 font-bold py-10">No messages found.</p>}
                        </div>
                    </div>
                );
            case 'notices':
                return (
                    <div className="space-y-8">
                        {/* Upload Section */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                                <Upload size={24} className="text-orange-500" /> Upload New Notice
                            </h3>
                            <form onSubmit={handleUpload} className="flex flex-col gap-4 max-w-xl">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Notice Title</label>
                                    <input
                                        type="text"
                                        value={newNotice.title || ''}
                                        onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                                        placeholder="Enter notice title..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-orange-500 font-bold"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Category</label>
                                    <div className="flex gap-4">
                                        {['HSC', 'Honours', 'Masters'].map(cat => (
                                            <label key={cat} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    value={cat}
                                                    checked={newNotice.category === cat}
                                                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                                                    className="w-4 h-4 text-orange-500 accent-orange-500"
                                                />
                                                <span className={`font-bold text-sm ${newNotice.category === cat ? 'text-orange-600' : 'text-slate-600'}`}>
                                                    {cat}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
                                    <textarea
                                        value={newNotice.description || ''}
                                        onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
                                        placeholder="Enter notice description details..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-orange-500 font-bold h-32"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Notice File (PDF/Image) - Optional</label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-orange-500 font-bold text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                    />
                                </div>
                                <button type="submit" className="bg-[#064e3b] text-white py-3 rounded-lg font-black uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-lg flex justify-center items-center gap-2">
                                    <Upload size={18} /> Publish Notice
                                </button>
                            </form>
                        </div>

                        {/* List Section */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                    <FileText size={24} className="text-[#064e3b]" /> Manage Notices
                                </h3>
                                <span className="text-sm text-slate-400 font-bold">
                                    {filteredNotices.length} of {notices.length} notices
                                </span>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Category:</label>
                                    <select
                                        value={filterCategory}
                                        onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
                                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-orange-500"
                                    >
                                        <option value="All">All</option>
                                        <option value="HSC">HSC</option>
                                        <option value="Honours">Honours</option>
                                        <option value="Masters">Masters</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Date:</label>
                                    <input
                                        type="date"
                                        value={filterDate}
                                        onChange={(e) => { setFilterDate(e.target.value); setCurrentPage(1); }}
                                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-orange-500"
                                    />
                                </div>
                                {(filterCategory !== 'All' || filterDate) && (
                                    <button
                                        onClick={() => { setFilterCategory('All'); setFilterDate(''); setCurrentPage(1); }}
                                        className="text-xs font-bold text-orange-500 hover:text-orange-600 underline"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                            <div className="space-y-4">
                                {paginatedNotices.length > 0 ? paginatedNotices.map(notice => (
                                    <div key={notice.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-orange-200 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-orange-500 shadow-sm font-black border border-slate-100">
                                                {new Date(notice.published_at || notice.created_at || Date.now()).getDate()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-slate-800">{notice.title}</h4>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${notice.category === 'HSC' ? 'bg-blue-100 text-blue-600' :
                                                        notice.category === 'Honours' ? 'bg-green-100 text-green-600' :
                                                            'bg-purple-100 text-purple-600'
                                                        }`}>
                                                        {notice.category}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-400 font-bold">
                                                    {new Date(notice.published_at || notice.created_at || Date.now()).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDelete(notice.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                )) : (
                                    <p className="text-center py-8 text-slate-400 font-bold">No notices found</p>
                                )}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft size={16} /> Previous
                                    </button>
                                    <div className="flex items-center gap-2">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-8 h-8 rounded-lg font-bold text-sm transition-all ${currentPage === page
                                                    ? 'bg-[#064e3b] text-white'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        Next <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'faculty':
                return (
                    <div className="space-y-8">
                        {/* Add Faculty Section */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                                <Users size={24} className="text-emerald-600" /> Add New Faculty Member
                            </h3>
                            <form onSubmit={handleFacultyUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={newFaculty.name || ''}
                                        onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                                        placeholder="Enter name..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 font-bold"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Designation</label>
                                    <input
                                        type="text"
                                        value={newFaculty.designation || ''}
                                        onChange={(e) => setNewFaculty({ ...newFaculty, designation: e.target.value })}
                                        placeholder="e.g. Professor, Lecturer..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 font-bold"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Qualification</label>
                                    <input
                                        type="text"
                                        value={newFaculty.qualification || ''}
                                        onChange={(e) => setNewFaculty({ ...newFaculty, qualification: e.target.value })}
                                        placeholder="e.g. PhD, M.Sc..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Specialization</label>
                                    <input
                                        type="text"
                                        value={newFaculty.specialization || ''}
                                        onChange={(e) => setNewFaculty({ ...newFaculty, specialization: e.target.value })}
                                        placeholder="e.g. Abstract Algebra..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={newFaculty.email || ''}
                                        onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                                        placeholder="email@example.com"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Phone Number</label>
                                    <input
                                        type="text"
                                        value={newFaculty.phone || ''}
                                        onChange={(e) => setNewFaculty({ ...newFaculty, phone: e.target.value })}
                                        placeholder="Enter phone..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Profile Image</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setNewFaculty({ ...newFaculty, image: e.target.files[0] })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 font-bold text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Sort Order</label>
                                    <input
                                        type="number"
                                        value={newFaculty.order || ''}
                                        onChange={(e) => setNewFaculty({ ...newFaculty, order: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 font-bold"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <button type="submit" className="w-full bg-[#064e3b] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-lg flex justify-center items-center gap-2">
                                        <Upload size={20} /> Add Faculty Member
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Faculty List Section */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                                <Users size={24} className="text-[#064e3b]" /> Faculty Members ({facultyMembers.length})
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {facultyMembers.map(member => (
                                    <div key={member.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4 relative group">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0 border-2 border-white shadow-sm">
                                            {member.image_path ? (
                                                <img src={member.image_path.startsWith('http') ? member.image_path : `http://127.0.0.1:8000/${member.image_path}`} alt={member.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                    <UserCircle size={40} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-800 truncate">{member.name}</h4>
                                            <p className="text-[10px] font-black uppercase text-orange-500 tracking-wider mb-1">{member.designation}</p>
                                            <p className="text-[10px] text-slate-500 font-bold truncate">{member.qualification}</p>
                                        </div>
                                        <button
                                            onClick={() => handleFacultyDelete(member.id)}
                                            className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                {facultyMembers.length === 0 && (
                                    <div className="col-span-full py-10 text-center text-slate-400 font-bold">
                                        No faculty members added yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 'gallery':
                return (
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                                <ImageIcon size={24} className="text-orange-500" /> Add to Gallery
                            </h3>
                            <form onSubmit={handleGalleryUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text" placeholder="Title / Event Name" className="bg-slate-50 p-3 rounded-lg border font-bold"
                                    value={newGallery.title} onChange={e => setNewGallery({ ...newGallery, title: e.target.value })} required
                                />
                                <input type="file" className="p-3 font-bold text-sm text-slate-500" onChange={e => setNewGallery({ ...newGallery, image: e.target.files[0] })} required />
                                <button type="submit" className="md:col-span-2 bg-[#064e3b] text-white py-3 rounded-lg font-black uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-lg">Upload to Gallery</button>
                            </form>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-xl font-black text-slate-800 mb-6">Gallery Items ({gallery.length})</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {gallery.map(item => (
                                    <div key={item.id} className="relative group rounded-xl overflow-hidden aspect-video border border-slate-100">
                                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-4">
                                            <p className="text-white text-xs font-bold mb-4 text-center">{item.title}</p>
                                            <button onClick={() => handleGalleryDelete(item.id)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'settings':
                return <div className="p-10 text-center font-bold text-slate-400">Settings management coming soon...</div>;
            case 'resources':
                return (
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                                <BookOpen size={24} className="text-blue-500" /> Add Resource
                            </h3>
                            <form onSubmit={handleResourceUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text" placeholder="Resource Title" className="bg-slate-50 p-3 rounded-lg border font-bold"
                                    value={newResource.title} onChange={e => setNewResource({ ...newResource, title: e.target.value })} required
                                />
                                <select
                                    className="bg-slate-50 p-3 rounded-lg border font-bold"
                                    value={newResource.category} onChange={e => setNewResource({ ...newResource, category: e.target.value })}
                                >
                                    <option value="Syllabus">Syllabus & Curriculum</option>
                                    <option value="Question Bank">Question Bank</option>
                                    <option value="E-Library">E-Library</option>
                                    <option value="Other">Other</option>
                                </select>
                                <textarea
                                    placeholder="Description" className="bg-slate-50 p-3 rounded-lg border font-bold md:col-span-2"
                                    value={newResource.description} onChange={e => setNewResource({ ...newResource, description: e.target.value })}
                                />
                                <input type="file" className="md:col-span-2 p-3 font-bold text-sm text-slate-500" onChange={e => setNewResource({ ...newResource, file: e.target.files[0] })} required />
                                <button type="submit" className="md:col-span-2 bg-blue-600 text-white py-3 rounded-lg font-black uppercase">Upload Resource</button>
                            </form>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-xl font-black text-slate-800 mb-6">Existing Resources ({resources.length})</h3>
                            <div className="space-y-4">
                                {resources.map(r => (
                                    <div key={r.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        <div>
                                            <h4 className="font-bold">{r.title}</h4>
                                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">{r.category}</span>
                                        </div>
                                        <button onClick={() => handleResourceDelete(r.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'library':
                return (
                    <div className="space-y-8">
                        {/* Add Book Section */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                                <Library size={24} className="text-emerald-600" /> Add New Book
                            </h3>
                            <form onSubmit={handleBookUpload} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <input
                                    type="text" placeholder="Accession Number (Unique ID)" className="bg-slate-50 p-3 rounded-lg border font-bold"
                                    value={newBook.accession_number} onChange={e => setNewBook({ ...newBook, accession_number: e.target.value })} required
                                />
                                <input
                                    type="text" placeholder="Book Title" className="bg-slate-50 p-3 rounded-lg border font-bold"
                                    value={newBook.title} onChange={e => setNewBook({ ...newBook, title: e.target.value })} required
                                />
                                <input
                                    type="text" placeholder="Author Name" className="bg-slate-50 p-3 rounded-lg border font-bold"
                                    value={newBook.author} onChange={e => setNewBook({ ...newBook, author: e.target.value })} required
                                />
                                <input
                                    type="number" placeholder="Qty" min="1" className="bg-slate-50 p-3 rounded-lg border font-bold"
                                    value={newBook.quantity} onChange={e => setNewBook({ ...newBook, quantity: parseInt(e.target.value) || 1 })} required
                                />
                                <button type="submit" className="md:col-span-4 bg-[#064e3b] text-white py-3 rounded-lg font-black uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-lg">
                                    Add Book to Library
                                </button>
                            </form>
                        </div>

                        {/* Lending Modal */}
                        {showLendModal && (
                            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                                <div className="bg-white p-8 rounded-2xl max-w-lg w-full shadow-2xl">
                                    <h3 className="text-xl font-black mb-4">Lend Book: {selectedBook?.title}</h3>
                                    <form onSubmit={handleLendSubmit} className="space-y-4">
                                        <input type="text" placeholder="Student Name" className="w-full border p-2 rounded" required onChange={e => setBorrower({ ...borrower, borrower_name: e.target.value })} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="text" placeholder="Class Roll" className="border p-2 rounded" required onChange={e => setBorrower({ ...borrower, borrower_roll: e.target.value })} />
                                            <input type="text" placeholder="Session (e.g. 2023-24)" className="border p-2 rounded" required onChange={e => setBorrower({ ...borrower, borrower_session: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <select className="border p-2 rounded" required onChange={e => setBorrower({ ...borrower, borrower_program: e.target.value })}>
                                                <option value="">Select Program</option>
                                                <option value="HSC">HSC</option>
                                                <option value="Honours">Honours</option>
                                                <option value="Masters">Masters</option>
                                            </select>
                                            <input type="text" placeholder="Phone Number" className="border p-2 rounded" required onChange={e => setBorrower({ ...borrower, borrower_phone: e.target.value })} />
                                        </div>
                                        <div className="flex gap-4 pt-4">
                                            <button type="button" onClick={() => setShowLendModal(false)} className="flex-1 bg-slate-200 py-2 rounded font-bold">Cancel</button>
                                            <button type="submit" className="flex-1 bg-orange-500 text-white py-2 rounded font-bold">Confirm Lending</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Books List */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-xl font-black text-slate-800 mb-6">Library Inventory ({books.length})</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-xs font-black uppercase text-slate-500 border-b">
                                            <th className="p-3">Accession No</th>
                                            <th className="p-3">Title / Author</th>
                                            <th className="p-3">Qty</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-bold text-slate-700">
                                        {books.map(book => (
                                            <tr key={book.id} className="border-b last:border-0 hover:bg-slate-50">
                                                <td className="p-3 text-orange-600">{book.accession_number}</td>
                                                <td className="p-3">
                                                    <div>{book.title}</div>
                                                    <div className="text-xs text-slate-400 font-normal">{book.author}</div>
                                                </td>
                                                <td className="p-3 font-bold text-slate-500">{book.quantity}</td>
                                                <td className="p-3">
                                                    {book.is_available ? (
                                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Available</span>
                                                    ) : (
                                                        <div className="text-xs">
                                                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full block w-fit mb-1">Borrowed</span>
                                                            <span className="text-slate-500 block">By: {book.borrower_name} ({book.borrower_roll})</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-3 flex gap-2">
                                                    {book.is_available ? (
                                                        <button
                                                            onClick={() => { setSelectedBook(book); setShowLendModal(true); }}
                                                            className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition"
                                                        >
                                                            Lend
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleReturnBook(book.id)}
                                                            className="bg-orange-100 text-orange-600 px-3 py-1 rounded hover:bg-orange-200 transition"
                                                        >
                                                            Return
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleBookDelete(book.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={18} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );


        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex font-sans">
            {/* Sidebar */}
            <aside
                className={`bg-[#042f24] text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col fixed h-full z-20`}
            >
                <div className="p-4 flex items-center justify-between border-b border-emerald-800">
                    <span className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>Admin Panel</span>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-emerald-800 rounded">
                        <Menu size={20} />
                    </button>
                </div>

                <nav className="flex-1 mt-6">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-4 py-4 transition-colors ${activeTab === item.id ? 'bg-orange-600 text-white' : 'text-emerald-100 hover:bg-emerald-900 border-l-4 border-transparent hover:border-orange-500'}`}
                        >
                            <item.icon size={20} />
                            <span className={`flex-1 text-left ${!sidebarOpen && 'hidden'}`}>{item.label}</span>
                            {item.badge > 0 && sidebarOpen && (
                                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">{item.badge}</span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-emerald-800">
                    <button className="w-full flex items-center gap-4 px-4 py-3 text-red-300 hover:bg-red-900/20 rounded transition-colors">
                        <LogOut size={20} />
                        <span className={`${!sidebarOpen && 'hidden'}`}>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} p-8`}>
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h1>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 border border-orange-200">
                            <UserCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">Super Admin</p>
                            <p className="text-xs text-slate-500">admin@ghmmc.edu.bd</p>
                        </div>
                    </div>
                </header>

                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboard;
