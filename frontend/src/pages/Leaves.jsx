import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CalendarDays, Filter, UserCheck, UserX, Clock, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Leaves = () => {
    const { user } = useAuth();
    const [date, setDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [leaves, setLeaves] = useState([]);
    const [newLeave, setNewLeave] = useState({
        type: 'Sick',
        startDate: '',
        endDate: '',
        reason: ''
    });

    const fetchLeaves = async () => {
        try {
            const endpoint = user?.role === 'admin' ? 'http://localhost:5000/api/leaves' : 'http://localhost:5000/api/leaves/my';
            const { data } = await axios.get(endpoint);
            setLeaves(data);
        } catch (error) {
            console.error('Error fetching leaves:', error);
        }
    };

    useEffect(() => {
        fetchLeaves();
        const interval = setInterval(fetchLeaves, 30000);
        return () => clearInterval(interval);
    }, [user?.role]);

    const handleApplyLeave = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/leaves', {
                ...newLeave,
                employeeId: user._id
            });
            setIsModalOpen(false);
            fetchLeaves();
            // Show a custom success state instead of windows alert
            setNewLeave({ type: 'Sick', startDate: '', endDate: '', reason: '' });
        } catch (error) {
            alert(error.response?.data?.message || 'Error applying for leave');
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/leaves/${id}`, { status });
            fetchLeaves();
        } catch (error) {
            alert('Error updating leave status');
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Attendance & Absences</h1>
                    <p className="text-sm text-slate-500 font-medium">Manage corporate time-off and availability requests.</p>
                </div>
                {user?.role === 'employee' && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary flex items-center justify-center gap-2 px-8 py-3"
                    >
                        <Plus size={18} /> Submit Absence Request
                    </button>
                )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar Column */}
                <div className="lg:col-span-1">
                    <div className="card-classic p-6 bg-white overflow-hidden">
                        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase text-[11px] tracking-widest border-b border-slate-50 pb-4">
                            <CalendarDays className="text-emerald-600" size={16} /> Enterprise Calendar
                        </h3>
                        <Calendar
                            onChange={setDate}
                            value={date}
                            className="w-full border-none font-bold text-sm bg-transparent"
                            tileClassName={({ date, view }) =>
                                view === 'month' && date.getDay() === 0 ? 'text-red-500' : 'text-slate-700'
                            }
                        />
                    </div>

                    <div className="mt-8 card-classic p-6 bg-slate-50 border-slate-100">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Availability Status</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-600">Pending Requests</span>
                                <span className="text-xs font-bold text-slate-900">{leaves.filter(l => l.status === 'pending').length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-600">Approved This Month</span>
                                <span className="text-xs font-bold text-slate-900">{leaves.filter(l => l.status === 'approved').length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leaves Column */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-slate-900 uppercase tracking-widest text-[11px] mb-4">
                        {user?.role === 'admin' ? 'Administrative Approval Queue' : 'Historical Records'}
                    </h3>
                    <div className="space-y-4">
                        {leaves.length === 0 ? (
                            <div className="card-classic p-12 text-center text-slate-400 italic font-medium">
                                No absence records on file.
                            </div>
                        ) : (
                            leaves.map((leave) => (
                                <div key={leave._id} className="card-classic p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-emerald-200 transition-all text-left">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${leave.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' :
                                            leave.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">
                                                {user?.role === 'admin' ? `${leave.employee?.firstName} ${leave.employee?.lastName}` : leave.type}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded tracking-wide border border-emerald-100">{leave.type}</span>
                                                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                                                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-2 font-medium italic">"{leave.reason}"</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {user?.role === 'admin' && leave.status === 'pending' ? (
                                            <>
                                                <button onClick={() => handleStatusUpdate(leave._id, 'approved')} className="px-4 py-2 bg-green-600 text-white rounded text-[10px] font-bold uppercase tracking-widest hover:bg-green-700 transition-all shadow-sm">Approve</button>
                                                <button onClick={() => handleStatusUpdate(leave._id, 'rejected')} className="px-4 py-2 bg-white text-red-600 border border-red-100 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 transition-all">Reject</button>
                                            </>
                                        ) : (
                                            <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded border tracking-widest ${leave.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' :
                                                leave.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                                                }`}>
                                                {leave.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-xl w-full max-w-lg p-10 relative shadow-2xl border border-slate-200"
                        >
                            <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 text-slate-400 hover:text-slate-900 transition-colors"><X size={20} /></button>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Absence Application</h2>
                            <p className="text-sm text-slate-500 mb-8 font-medium">Please provide accurate details for official record keeping.</p>

                            <form onSubmit={handleApplyLeave} className="space-y-6 text-left">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">Category</label>
                                    <select
                                        className="input-field"
                                        value={newLeave.type}
                                        onChange={e => setNewLeave({ ...newLeave, type: e.target.value })}
                                    >
                                        <option value="Sick">Medical Leave</option>
                                        <option value="Casual">Casual Absence</option>
                                        <option value="Earned">Privilege Leave</option>
                                        <option value="Other">Miscellaneous</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">Start Date</label>
                                        <input type="date" required className="input-field" onChange={e => setNewLeave({ ...newLeave, startDate: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">End Date</label>
                                        <input type="date" required className="input-field" onChange={e => setNewLeave({ ...newLeave, endDate: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">Justification</label>
                                    <textarea
                                        className="input-field min-h-[100px] py-4 resize-none"
                                        placeholder="State the primary reason for this request..."
                                        onChange={e => setNewLeave({ ...newLeave, reason: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="w-full btn-primary py-4 font-bold uppercase tracking-widest">Transmit Application</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .react-calendar { width: 100% !important; background: transparent !important; border: none !important; font-family: inherit !important; }
                .react-calendar__tile--now { background: #ecfdf5 !important; color: #059669 !important; border-radius: 4px; }
                .react-calendar__tile--active { background: #059669 !important; color: white !important; border-radius: 4px; box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.2) !important; }
                .react-calendar__navigation button { font-weight: 700; color: #1e293b; font-size: 0.9rem; }
                .react-calendar__month-view__weekdays__weekday { font-weight: 700; color: #94a3b8; text-transform: uppercase; font-size: 0.65rem; padding-bottom: 1rem; }
            `}</style>
        </div>
    );
};

export default Leaves;
