import React from 'react';
import { Bell, Search, User, ChevronDown, Sun, Moon, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <div className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 sticky top-0 z-40">
            {/* Search Bar */}
            <div className="flex-1 max-w-lg">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Search system resources..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-md py-2 pl-12 pr-6 text-sm outline-none focus:ring-1 focus:ring-emerald-600 transition-all placeholder:text-slate-400 font-medium"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-6">
                {/* Admin Login Button - Show only when not logged in */}
                {!user && (
                    <a 
                        href="/admin-login"
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-md hover:bg-emerald-700 transition-colors"
                    >
                        <Shield size={16} />
                        Admin Login
                    </a>
                )}

                {/* Status indicator - Show only when logged in */}
                {user && (
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold uppercase tracking-wider">System Live</span>
                    </div>
                )}

                {/* Icons - Show only when logged in */}
                {user && (
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-slate-50 rounded-md transition-all relative">
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-600 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                )}

                {/* Profile - Show only when logged in */}
                {user && (
                    <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
                        <div className="text-right hidden lg:block">
                            <h4 className="text-sm font-bold text-slate-900 leading-none">{user?.email.split('@')[0] || 'User'}</h4>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{user?.role || 'Staff'}</p>
                        </div>
                        <div className="relative group cursor-pointer">
                            <div className="w-9 h-9 rounded-md overflow-hidden border border-slate-200 shadow-sm">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${user?.email || 'U'}&background=059669&color=fff`}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
