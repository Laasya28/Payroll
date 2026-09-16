import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { FileText, Download, Eye, X, RefreshCw, AlertCircle } from 'lucide-react';

const API = 'http://localhost:5000/api';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const MyPayslips = () => {
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewPayslip, setViewPayslip] = useState(null);

    const fetchPayslips = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            const { data } = await axios.get(`${API}/payroll/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPayslips(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPayslips(); }, []);

    const handleDownload = (payslipId) => {
        const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
        window.open(`${API}/payroll/download/${payslipId}?token=${token}`, '_blank');
    };

    const handlePreview = (payslipId) => {
        const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
        window.open(`${API}/payroll/payslip/${payslipId}?token=${token}`, '_blank');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Payslips</h2>
                    <p className="text-xs text-slate-400 font-medium">Access your monthly salary slips</p>
                </div>
                <button onClick={fetchPayslips} className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg transition-colors">
                    <RefreshCw size={16} />
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Your Payslips</h3>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-400 text-sm">Loading payslips…</div>
                ) : payslips.length === 0 ? (
                    <div className="p-12 text-center">
                        <AlertCircle className="mx-auto text-slate-300 mb-3" size={36} />
                        <p className="text-slate-400 text-sm font-medium">No payslips generated yet.</p>
                        <p className="text-slate-300 text-xs mt-1">Your HR will process your monthly payslip here.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {payslips.map(slip => {
                            const monthName = MONTHS[(slip.month - 1)] || slip.month;
                            return (
                                <div key={slip._id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{monthName} {slip.year}</p>
                                            <p className="text-xs font-semibold text-slate-400 mt-0.5">
                                                Generated {new Date(slip.createdAt).toLocaleDateString('en-IN')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-slate-900">₹{(slip.netSalary || 0).toLocaleString('en-IN')}</p>
                                            <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded mt-1 inline-block ${slip.status === 'paid' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                                                {slip.status}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handlePreview(slip._id)}
                                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDownload(slip._id)}
                                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                title="Download PDF"
                                            >
                                                <Download size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* View Modal */}
            {viewPayslip && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewPayslip(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-md p-8 relative shadow-2xl" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setViewPayslip(null)} className="absolute right-5 top-5 text-slate-400 hover:text-slate-900"><X size={20} /></button>
                        <div className="bg-emerald-600 text-white -mx-8 -mt-8 mb-6 px-8 py-6 rounded-t-2xl">
                            <h2 className="text-xl font-bold">Payslip</h2>
                            <p className="text-emerald-200 text-sm">{MONTHS[(viewPayslip.month - 1)] || viewPayslip.month} {viewPayslip.year}</p>
                        </div>
                        <div className="space-y-3 text-sm">
                            {[
                                ['Basic Salary', viewPayslip.basicSalary],
                                ['HRA', viewPayslip.hra],
                                ['Special Allowance', viewPayslip.specialAllowance],
                                ['Bonus', viewPayslip.bonus],
                                ['Overtime Pay', viewPayslip.overtimePay],
                            ].map(([label, val]) => (
                                <div key={label} className="flex justify-between py-2 border-b border-slate-50">
                                    <span className="text-slate-500">{label}</span>
                                    <span className="font-semibold text-slate-800">₹{(val || 0).toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                            <div className="flex justify-between py-2 border-b border-slate-50">
                                <span className="text-slate-500">Total Earnings</span>
                                <span className="font-semibold text-emerald-600">₹{(viewPayslip.totalEarnings || 0).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-50">
                                <span className="text-slate-500">Deductions</span>
                                <span className="font-semibold text-rose-600">- ₹{(viewPayslip.totalDeductions || 0).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between py-3 bg-emerald-50 px-4 rounded-xl mt-2">
                                <span className="font-bold text-slate-900">Net Salary</span>
                                <span className="font-black text-emerald-700 text-lg">₹{(viewPayslip.netSalary || 0).toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDownload(viewPayslip._id)}
                            className="w-full mt-6 bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Download size={16} /> Download PDF
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPayslips;
