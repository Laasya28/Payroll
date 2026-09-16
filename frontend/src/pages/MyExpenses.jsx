import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, Plus, Receipt, Upload, Eye, Download, X, RefreshCw, AlertCircle } from 'lucide-react';

const API = 'http://localhost:5000/api';

const MyExpenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [newExpense, setNewExpense] = useState({
        title: '',
        amount: '',
        category: 'Travel',
        description: '',
        dateOccurred: ''
    });
    const [receiptFile, setReceiptFile] = useState(null);

    const fetchExpenses = async () => {
        try {
            const { data } = await axios.get(`${API}/expenses/my`);
            setExpenses(data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            const formData = new FormData();
            Object.keys(newExpense).forEach(key => {
                formData.append(key, newExpense[key]);
            });
            if (receiptFile) {
                formData.append('receipt', receiptFile);
            }
            
            await axios.post(`${API}/expenses`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setShowModal(false);
            setNewExpense({ title: '', amount: '', category: 'Travel', description: '', dateOccurred: '' });
            setReceiptFile(null);
            fetchExpenses();
        } catch (error) {
            alert(error.response?.data?.message || 'Error submitting expense');
        }
        setUploading(false);
    };

    const handlePreview = (receiptUrl) => {
        setPreviewFile(`${API}${receiptUrl}`);
    };

    const handleDownload = (receiptUrl, title) => {
        const link = document.createElement('a');
        link.href = `${API}${receiptUrl}`;
        link.download = `${title}_receipt.jpg`;
        link.click();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Expenses</h2>
                    <p className="text-xs text-slate-400 font-medium">Submit and track corporate reimbursement claims</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
                    <Plus size={16} /> New Claim
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Expense History</h3>
                    <button onClick={fetchExpenses} className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg transition-colors">
                        <RefreshCw size={16} />
                    </button>
                </div>
                {loading ? (
                    <div className="p-12 text-center text-slate-400 text-sm">Loading expenses…</div>
                ) : expenses.length === 0 ? (
                    <div className="p-12 text-center">
                        <AlertCircle className="mx-auto text-slate-300 mb-3" size={36} />
                        <p className="text-slate-400 text-sm font-medium">No expense claims found.</p>
                        <p className="text-slate-300 text-xs mt-1">Submit your first expense claim to get started.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {expenses.map(exp => (
                            <div key={exp._id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center">
                                        <Receipt size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{exp.title}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">{exp.category}</span>
                                            <span className="text-xs font-semibold text-slate-400">{new Date(exp.dateOccurred).toLocaleDateString('en-IN')}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-slate-900">₹{exp.amount.toLocaleString('en-IN')}</p>
                                        <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded mt-1 inline-block ${
                                            exp.status === 'approved' ? 'text-emerald-600 bg-emerald-50' :
                                                exp.status === 'pending' ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50'
                                            }`}>{exp.status}</span>
                                    </div>
                                    {exp.receiptUrl && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handlePreview(exp.receiptUrl)}
                                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                title="Preview Receipt"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDownload(exp.receiptUrl, exp.title)}
                                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                title="Download Receipt"
                                            >
                                                <Download size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* New Expense Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-md p-8 relative shadow-2xl" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowModal(false)} className="absolute right-5 top-5 text-slate-400 hover:text-slate-900"><X size={20} /></button>
                        <div className="bg-emerald-600 text-white -mx-8 -mt-8 mb-6 px-8 py-6 rounded-t-2xl">
                            <h2 className="text-xl font-bold">New Expense Claim</h2>
                            <p className="text-emerald-200 text-sm">Submit your reimbursement request</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field w-full"
                                    value={newExpense.title}
                                    onChange={e => setNewExpense({ ...newExpense, title: e.target.value })}
                                    placeholder="Expense description"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Amount</label>
                                    <input
                                        type="number"
                                        required
                                        className="input-field w-full"
                                        value={newExpense.amount}
                                        onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
                                    <select
                                        className="input-field w-full"
                                        value={newExpense.category}
                                        onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}
                                    >
                                        <option value="Travel">Travel</option>
                                        <option value="Food">Food</option>
                                        <option value="Equipment">Equipment</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Date</label>
                                <input
                                    type="date"
                                    required
                                    className="input-field w-full"
                                    value={newExpense.dateOccurred}
                                    onChange={e => setNewExpense({ ...newExpense, dateOccurred: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
                                <textarea
                                    className="input-field w-full min-h-[80px]"
                                    value={newExpense.description}
                                    onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
                                    placeholder="Additional details..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Receipt (Optional)</label>
                                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:border-emerald-400 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={e => setReceiptFile(e.target.files[0])}
                                        className="hidden"
                                        id="receipt-upload"
                                    />
                                    <label htmlFor="receipt-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                        <Upload size={20} className="text-slate-400" />
                                        <span className="text-xs text-slate-500">
                                            {receiptFile ? receiptFile.name : 'Click to upload receipt'}
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full btn-primary py-3 font-bold uppercase tracking-widest disabled:opacity-60"
                            >
                                {uploading ? 'Submitting...' : 'Submit Claim'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewFile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setPreviewFile(null)}>
                    <div className="bg-white rounded-2xl p-4 relative shadow-2xl max-w-4xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setPreviewFile(null)} className="absolute right-4 top-4 text-white bg-slate-900/80 p-2 rounded-lg hover:bg-slate-900 z-10">
                            <X size={20} />
                        </button>
                        <img src={previewFile} alt="Receipt" className="max-w-full h-auto rounded-lg" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyExpenses;
