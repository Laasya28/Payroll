import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, User, Phone, Lock, Building2, ArrowRight, ArrowLeft, CheckCircle2, UserPlus, Briefcase } from 'lucide-react';

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '', firstName: '', lastName: '', phone: '', password: '', role: 'employee', position: ''
    });
    const navigate = useNavigate();

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form data
        if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
            alert('Please fill in all required fields');
            return;
        }
        
        if (formData.password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }
        
        try {
            if (step === 2) {
                const { data } = await axios.post('http://localhost:5000/api/auth/register', formData);
                
                // Store user data immediately for persistence
                localStorage.setItem('userInfo', JSON.stringify(data));
                
                alert('Registration successful! Redirecting to dashboard...');
                
                // Navigate based on role
                setTimeout(() => {
                    if (data.role === 'admin') {
                        window.location.href = '/admin';
                    } else {
                        window.location.href = '/dashboard';
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error.response?.data?.message || 'Registration failed. Please check your details.';
            alert(errorMessage);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-emerald-800/60 to-slate-900/80"></div>
            
            {/* Content */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-lg">
                    {/* Glass Form */}
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12">
                        {/* Logo and Title */}
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-emerald-600/20 backdrop-blur-sm border border-emerald-400/30 rounded-2xl flex items-center justify-center">
                                    <UserPlus size={32} className="text-emerald-300" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Join Our Team</h2>
                            <p className="text-emerald-200/80 font-medium text-sm">Create your professional account</p>

                            {/* Progress Steps */}
                            <div className="flex items-center justify-center gap-3 mt-8">
                                {[1, 2].map(i => (
                                    <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step === i ? 'w-8 bg-emerald-400' : 'w-4 bg-white/20'}`} />
                                ))}
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-emerald-200/90 mb-2">Work Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300/60" size={18} />
                                            <input
                                                type="email" required 
                                                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-12 py-4 text-white placeholder-emerald-300/50 focus:outline-none focus:border-emerald-400/50 focus:bg-white/15 transition-all"
                                                placeholder="yourname@company.com"
                                                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                    <button type="button" onClick={handleNext} className="w-full bg-emerald-600/80 backdrop-blur-sm hover:bg-emerald-600 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-3">
                                        Continue To Details <ArrowRight size={18} />
                                    </button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-emerald-200/90 mb-2">First Name</label>
                                            <div className="relative">
                                                <input type="text" required 
                                                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-4 text-white placeholder-emerald-300/50 focus:outline-none focus:border-emerald-400/50 focus:bg-white/15 transition-all"
                                                    placeholder="John"
                                                    value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                                    autoComplete="off"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-emerald-200/90 mb-2">Last Name</label>
                                            <div className="relative">
                                                <input type="text" required 
                                                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-4 text-white placeholder-emerald-300/50 focus:outline-none focus:border-emerald-400/50 focus:bg-white/15 transition-all"
                                                    placeholder="Doe"
                                                    value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                                    autoComplete="off"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-emerald-200/90 mb-2">Role</label>
                                            <div className="relative">
                                                <select
                                                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-emerald-400/50 focus:bg-white/15 transition-all appearance-none"
                                                    value={formData.role}
                                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                                >
                                                    <option value="employee" className="bg-gray-800">Employee</option>
                                                    <option value="admin" className="bg-gray-800">Administrator</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-emerald-200/90 mb-2">Position</label>
                                            <div className="relative">
                                                <input type="text" required 
                                                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-4 text-white placeholder-emerald-300/50 focus:outline-none focus:border-emerald-400/50 focus:bg-white/15 transition-all"
                                                    placeholder="Manager"
                                                    value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })}
                                                    autoComplete="off"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-emerald-200/90 mb-2">Phone Number (+91)</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300/60" size={16} />
                                            <input
                                                type="tel" required
                                                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-12 py-4 text-white placeholder-emerald-300/50 focus:outline-none focus:border-emerald-400/50 focus:bg-white/15 transition-all"
                                                placeholder="98765 43210"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-emerald-200/90 mb-2">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300/60" size={18} />
                                            <input
                                                type="password" required 
                                                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-12 py-4 text-white placeholder-emerald-300/50 focus:outline-none focus:border-emerald-400/50 focus:bg-white/15 transition-all"
                                                placeholder="••••••••"
                                                value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                autoComplete="new-password"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-2">
                                        <button type="button" onClick={handleBack} className="p-4 rounded-xl border border-white/20 hover:bg-white/10 transition-colors text-emerald-300">
                                            <ArrowLeft size={20} />
                                        </button>
                                        <button type="submit" className="flex-1 bg-emerald-600/80 backdrop-blur-sm hover:bg-emerald-600 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-lg hover:shadow-emerald-500/25">
                                            Complete Registration
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>

                        {/* Footer Links */}
                        <div className="mt-8 text-center">
                            <p className="text-emerald-200/70 text-sm">
                                Already have an account? <Link to="/login" className="text-emerald-300 hover:text-emerald-200 font-medium transition-colors">Sign in here</Link>
                            </p>
                        </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="text-center mt-6">
                        <p className="text-emerald-200/50 text-xs">
                            Secure registration powered by PayRollHub
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
