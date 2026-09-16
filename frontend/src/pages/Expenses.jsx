import React, { useState, useEffect } from 'react';
import { Receipt, Plus, Search, CheckCircle, XCircle, Clock, ExternalLink, Shield, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API}/expenses`);
            setExpenses(data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            // Fallback to mock data if API fails
            setExpenses([
                { _id: '1', title: 'Uber for Client Meeting', amount: 45.50, category: 'Travel', date: '2026-02-24', status: 'pending', employee: { firstName: 'John', lastName: 'Doe' } },
                { _id: '2', title: 'Office Supplies', amount: 120.00, category: 'Equipment', date: '2026-02-22', status: 'approved', employee: { firstName: 'Jane', lastName: 'Smith' } },
                { _id: '3', title: '80C Investment Proof', amount: 150000, category: 'Tax Proof', date: '2026-02-25', status: 'pending', employee: { firstName: 'Mike', lastName: 'Johnson' } },
                { _id: '4', title: 'Conference Registration', amount: 5000.00, category: 'Training', date: '2026-02-23', status: 'approved', employee: { firstName: 'Sarah', lastName: 'Williams' } },
                { _id: '5', title: 'Client Dinner', amount: 2500.00, category: 'Entertainment', date: '2026-02-21', status: 'pending', employee: { firstName: 'David', lastName: 'Brown' } },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleApprove = async (id) => {
        try {
            await axios.put(`${API}/expenses/${id}/approve`);
            setExpenses(expenses.map(exp => 
                exp._id === id ? { ...exp, status: 'approved' } : exp
            ));
        } catch (error) {
            console.error('Error approving expense:', error);
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.put(`${API}/expenses/${id}/reject`);
            setExpenses(expenses.map(exp => 
                exp._id === id ? { ...exp, status: 'rejected' } : exp
            ));
        } catch (error) {
            console.error('Error rejecting expense:', error);
        }
    };

    const filteredExpenses = expenses.filter(exp => {
        const userName = exp.employee ? `${exp.employee.firstName} ${exp.employee.lastName}` : 
                           exp.user || 'Employee';
        const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exp.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || exp.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: expenses.length,
        pending: expenses.filter(exp => exp.status === 'pending').length,
        approved: expenses.filter(exp => exp.status === 'approved').length,
        rejected: expenses.filter(exp => exp.status === 'rejected').length,
        totalAmount: expenses.reduce((sum, exp) => sum + exp.amount, 0)
    };

    return (
        <div className="space-y-10">
            <header className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-black text-text tracking-tighter">Reimbursements</h1>
                    <p className="text-gray-400 font-bold mt-2">Oversee corporate spending and claim verifications.</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-white border-2 border-slate-100 text-slate-400 font-bold py-3 px-6 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2">
                        <Shield size={18} /> Submit Investment Proofs
                    </button>
                    <button onClick={fetchExpenses} className="bg-white border-2 border-slate-100 text-slate-400 font-bold py-3 px-6 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2">
                        <RefreshCw size={18} /> Refresh
                    </button>
                    <button className="btn-primary flex items-center gap-2 font-black py-3 px-6 shadow-emerald-200">
                        <Plus size={18} /> File Reimbursement
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-4">
                    <div className="glass-card bg-white border-gray-100 p-4 mb-6">
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="text" 
                                    placeholder="Search claims..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm font-bold outline-none focus:bg-white transition-all"
                                />
                            </div>
                            <select 
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold outline-none focus:bg-white transition-all"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="glass-card p-12 bg-white border-gray-100 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                            <p className="text-gray-400 font-bold">Loading expenses...</p>
                        </div>
                    ) : filteredExpenses.length === 0 ? (
                        <div className="glass-card p-12 bg-white border-gray-100 text-center">
                            <Receipt className="mx-auto text-gray-300 mb-4" size={48} />
                            <p className="text-gray-400 font-bold">No expenses found</p>
                            <p className="text-gray-300 text-sm mt-2">Try adjusting your search or filter criteria</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredExpenses.map((exp) => (
                            <div key={exp._id} className="glass-card p-6 bg-white border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all border-l-4 border-l-primary">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary font-black">
                                        <Receipt size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-black text-lg text-text">{exp.title}</h3>
                                            <span className="text-[10px] font-black uppercase text-accent bg-accent/5 px-2 py-0.5 rounded-full">{exp.category}</span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                                                By {exp.employee ? `${exp.employee.firstName} ${exp.employee.lastName}` : 
                                                   exp.user || 'Employee'}
                                            </p>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                                                {new Date(exp.dateOccurred || exp.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-10">
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-text">₹{exp.amount.toFixed(2)}</p>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                                            exp.status === 'approved' ? 'text-green-500' : 
                                            exp.status === 'rejected' ? 'text-red-500' : 
                                            'text-yellow-500'
                                        }`}>
                                            {exp.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {exp.status === 'pending' && (
                                            <>
                                                <button 
                                                    onClick={() => handleApprove(exp._id)}
                                                    className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
                                                    title="Approve"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleReject(exp._id)}
                                                    className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                                                    title="Reject"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </>
                                        )}
                                        <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-colors" title="View Details">
                                            <ExternalLink size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card p-8 bg-black text-white shadow-2xl">
                        <h3 className="text-sm font-black uppercase tracking-widest text-white/50 mb-6">Expense Statistics</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-black uppercase text-white/70">Total Claims</span>
                                <span className="text-lg font-bold text-white">{stats.total}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-black uppercase text-white/70">Pending</span>
                                <span className="text-lg font-bold text-yellow-400">{stats.pending}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-black uppercase text-white/70">Approved</span>
                                <span className="text-lg font-bold text-green-400">{stats.approved}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-black uppercase text-white/70">Rejected</span>
                                <span className="text-lg font-bold text-red-400">{stats.rejected}</span>
                            </div>
                            <div className="border-t border-white/20 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-black uppercase text-white/70">Total Amount</span>
                                    <span className="text-lg font-bold text-white">₹{stats.totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="glass-card p-8 bg-black text-white shadow-2xl">
                        <h3 className="text-sm font-black uppercase tracking-widest text-white/50 mb-6">Budget Health</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs font-black uppercase mb-2">
                                    <span>Spent</span>
                                    <span>72%</span>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[72%]"></div>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs font-bold text-white/40 mt-8 leading-relaxed">Financial reports are generated every 24 hours.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Expenses;
