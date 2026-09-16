import React, { useState } from 'react';
import { CircleDollarSign, Download, Play, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const Payroll = () => {
    const [selectedMonth, setSelectedMonth] = useState('February 2026');
    const [downloading, setDownloading] = useState(null);

    const handleDownload = (id) => {
        setDownloading(id);
        setTimeout(() => {
            setDownloading(null);
            alert('Payslip downloaded successfully!');
        }, 1500);
    };

    return (
        <div className="space-y-10">
            <header className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-black text-text tracking-tighter">Financial Records</h1>
                    <p className="text-gray-400 font-bold mt-2">Manage monthly disbursements and tax projections.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={16} />
                        <select
                            value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
                            className="bg-white border border-slate-200 rounded-2xl pl-10 pr-10 py-3 font-black text-[10px] uppercase tracking-widest text-text outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm appearance-none"
                        >
                            <option>February 2026</option>
                            <option>January 2026</option>
                        </select>
                    </div>
                    <button className="btn-primary shadow-emerald-200/50">
                        <Play size={18} fill="currentColor" /> Process Payroll
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-card p-8 bg-primary text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-2">Cycle Payout</p>
                        <h3 className="text-4xl font-black tracking-tighter">₹8,42,500.00</h3>
                        <div className="mt-6 flex items-center gap-2 text-xs font-bold text-white/80">
                            <CheckCircle2 size={14} /> Compliance verified
                        </div>
                    </div>
                    <CircleDollarSign size={120} className="absolute -right-8 -bottom-8 text-white/10 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="glass-card p-8 bg-white border-gray-100 shadow-sm">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Pending Entitlements</p>
                    <h3 className="text-4xl font-black text-text tracking-tighter underline decoration-secondary decoration-4 underline-offset-8">28 Units</h3>
                    <p className="text-xs font-bold text-secondary mt-6">Awaiting Admin Signature</p>
                </div>
                <div className="card-classic p-8 bg-white shadow-sm border-slate-100 group">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Advance Tax Projection</p>
                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <span className="text-4xl font-black text-slate-900 tracking-tighter">₹1,42,000</span>
                            <p className="text-[10px] font-bold text-emerald-600 mt-2 uppercase">Optimize deductions now</p>
                        </div>
                        <div className="w-16 h-16 rounded-full border-4 border-slate-50 border-t-emerald-500 animate-spin-slow"></div>
                    </div>
                </div>
            </div>

            <div className="glass-card overflow-hidden bg-white border-gray-100">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black tracking-widest uppercase">
                            <th className="px-8 py-5">Entity Name</th>
                            <th className="px-8 py-5">Computed Net</th>
                            <th className="px-8 py-5">Compliance</th>
                            <th className="px-8 py-5 text-right">Statement</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {[
                            { name: 'John Doe', net: 5200, status: 'verified' },
                            { name: 'Jane Smith', net: 6500, status: 'pending' },
                        ].map((item, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-8 py-6 font-black text-sm text-text">{item.name}</td>
                                <td className="px-8 py-6 font-black text-sm text-primary">₹{item.net.toLocaleString()}</td>
                                <td className="px-8 py-6">
                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${item.status === 'verified' ? 'bg-green-50 text-green-500 border border-green-100' : 'bg-yellow-50 text-yellow-600 border border-yellow-100'}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button
                                        onClick={() => handleDownload(i)}
                                        disabled={downloading === i}
                                        className="text-slate-300 hover:text-emerald-600 transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Download Certified Payslip"
                                    >
                                        {downloading === i ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Clock size={20} /></motion.div> : <Download size={20} />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Payroll;
