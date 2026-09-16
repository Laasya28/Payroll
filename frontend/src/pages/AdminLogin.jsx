import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, Mail, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        if (!formData.email || !formData.password) {
            alert('Please enter both email and password');
            setLoading(false);
            return;
        }
        
        try {
            const userData = await login(formData.email, formData.password);
            
            // Check if user is admin
            if (userData.role === 'admin') {
                window.location.href = '/admin';
            } else {
                alert('Access denied. Admin credentials required.');
            }
        } catch (error) {
            console.error('Admin login error:', error);
            alert(error.message || 'Invalid admin credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-teal-700/80 via-green-700/70 to-lime-800/80"></div>
            
            {/* Content */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Glass Form */}
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10">
                        {/* Logo and Title */}
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-teal-600/20 backdrop-blur-sm border border-teal-400/30 rounded-2xl flex items-center justify-center">
                                    <Shield size={32} className="text-teal-200" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Admin Portal</h2>
                            <p className="text-teal-100/80 font-medium text-sm">Secure system administration</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-teal-100/90 mb-2">Administrator Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-200/60" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-12 py-4 text-white placeholder-teal-200/50 focus:outline-none focus:border-teal-300/50 focus:bg-white/15 transition-all"
                                            placeholder="admin@company.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-teal-100/90 mb-2">Administrator Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-200/60" size={18} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-12 pr-14 py-4 text-white placeholder-teal-200/50 focus:outline-none focus:border-teal-300/50 focus:bg-white/15 transition-all"
                                            placeholder="Enter admin password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-200/60 hover:text-teal-100 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-teal-600/80 backdrop-blur-sm hover:bg-teal-600 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-lg hover:shadow-teal-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    <Shield size={18} />
                                    {loading ? 'Authenticating...' : 'Access Admin Panel'}
                                </button>
                            </div>
                        </form>

                        {/* Security Notice */}
                        <div className="mt-6 p-4 bg-teal-500/20 backdrop-blur-sm border border-teal-400/30 rounded-xl">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="text-teal-300 mt-0.5" size={16} />
                                <div>
                                    <h4 className="text-sm font-bold text-teal-200 mb-1">Authorized Access Only</h4>
                                    <p className="text-xs text-teal-100/80">
                                        This portal is restricted to system administrators. Unauthorized access attempts are logged and monitored.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Links */}
                        <div className="mt-8 text-center">
                            <a 
                                href="/login" 
                                className="text-teal-200 hover:text-teal-100 font-medium text-sm transition-colors"
                            >
                                ← Back to Employee Login
                            </a>
                        </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="text-center mt-6">
                        <p className="text-teal-100/50 text-xs">
                            Secure admin access powered by PayRollHub
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
