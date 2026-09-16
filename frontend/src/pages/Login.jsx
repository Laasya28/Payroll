import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, ShieldCheck, ArrowLeft, Users } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }
        
        try {
            const userData = await login(email, password);
            
            // Navigate based on role
            if (userData.role === 'admin') {
                window.location.href = '/admin';
            } else {
                window.location.href = '/dashboard';
            }
        } catch (error) {
            console.error('Login error:', error);
            alert(error.message || 'Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&h=1080&fit=crop')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-emerald-800/60 to-slate-900/80"></div>
            
            {/* Content */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Glass Form */}
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10">
                        {/* Logo and Title */}
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-emerald-600/20 backdrop-blur-sm border border-emerald-400/30 rounded-2xl flex items-center justify-center">
                                    <Users size={32} className="text-emerald-300" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Employee Portal</h2>
                            <p className="text-emerald-200/80 font-medium text-sm">Access your workspace</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-emerald-200/90 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300/60" size={18} />
                                        <input
                                            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-12 py-4 text-white placeholder-emerald-300/50 focus:outline-none focus:border-emerald-400/50 focus:bg-white/15 transition-all"
                                            placeholder="employee@organization.com"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-emerald-200/90 mb-2">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300/60" size={18} />
                                        <input
                                            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-12 py-4 text-white placeholder-emerald-300/50 focus:outline-none focus:border-emerald-400/50 focus:bg-white/15 transition-all"
                                            placeholder="••••••••"
                                            autoComplete="new-password"
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-emerald-600/80 backdrop-blur-sm hover:bg-emerald-600 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-3">
                                    <LogIn size={18} />
                                    Access Dashboard
                                </button>
                            </div>
                        </form>

                        {/* Footer Links */}
                        <div className="mt-8 text-center space-y-3">
                            <p className="text-emerald-200/70 text-sm">
                                Don't have an account? <Link to="/register" className="text-emerald-300 hover:text-emerald-200 font-medium transition-colors">Register Here</Link>
                            </p>
                            <p className="text-emerald-200/70 text-sm">
                                <Link to="/admin-login" className="text-emerald-300 hover:text-emerald-200 font-medium transition-colors">Admin Login →</Link>
                            </p>
                        </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="text-center mt-6">
                        <p className="text-emerald-200/50 text-xs">
                            Secure login powered by PayRollHub
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
