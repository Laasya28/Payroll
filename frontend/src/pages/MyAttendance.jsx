import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Calendar, Clock, CheckCircle2, AlertCircle, LogIn, LogOut, RefreshCw } from 'lucide-react';

const API = 'http://localhost:5000/api';

function formatTime(date) {
    if (!date) return '—';
    return new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}
function formatDate(date) {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function calcHours(clockIn, clockOut) {
    if (!clockIn || !clockOut) return '—';
    const ms = new Date(clockOut) - new Date(clockIn);
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return `${h}h ${m}m`;
}

const MyAttendance = () => {
    const [records, setRecords] = useState([]);
    const [todayRecord, setTodayRecord] = useState(null);
    const [liveTime, setLiveTime] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchAttendance = async () => {
        try {
            const { data } = await axios.get(`${API}/attendance/my`);
            setRecords(data);
            const todayStr = new Date().toISOString().split('T')[0];
            const today = data.find(r => r.dateString === todayStr);
            setTodayRecord(today || null);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
        const poll = setInterval(fetchAttendance, 30000);
        const clock = setInterval(() => setLiveTime(new Date()), 1000);
        return () => { clearInterval(poll); clearInterval(clock); };
    }, []);

    const handleClockIn = async () => {
        setActionLoading(true);
        try {
            await axios.post(`${API}/attendance/clockin`);
            await fetchAttendance();
        } catch (e) {
            alert(e.response?.data?.message || 'Clock in failed');
        }
        setActionLoading(false);
    };

    const handleClockOut = async () => {
        setActionLoading(true);
        try {
            await axios.put(`${API}/attendance/clockout`);
            await fetchAttendance();
        } catch (e) {
            alert(e.response?.data?.message || 'Clock out failed');
        }
        setActionLoading(false);
    };

    const presentDays = records.filter(r => r.status === 'Completed' || r.status === 'Active').length;
    const lateDays = records.filter(r => {
        if (!r.clockIn) return false;
        const t = new Date(r.clockIn);
        return t.getHours() > 9 || (t.getHours() === 9 && t.getMinutes() > 15);
    }).length;
    const completedRecords = records.filter(r => r.clockIn && r.clockOut);
    const avgHours = completedRecords.length > 0
        ? (completedRecords.reduce((sum, r) => sum + (new Date(r.clockOut) - new Date(r.clockIn)), 0) / completedRecords.length / 3600000).toFixed(1)
        : '0.0';

    const isClockedIn = todayRecord?.status === 'Active';
    const isClockedOut = todayRecord?.status === 'Completed';

    return (
        <div className="space-y-6">
            {/* Header with live clock */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Attendance Logs</h2>
                    <p className="text-xs text-slate-400 font-medium">Review your daily clock-ins and working hours</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-2xl font-black text-emerald-600 font-mono">
                            {liveTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {liveTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>
                    {!isClockedOut && (
                        <button
                            onClick={isClockedIn ? handleClockOut : handleClockIn}
                            disabled={actionLoading}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-sm ${isClockedIn
                                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                } disabled:opacity-60`}
                        >
                            {isClockedIn ? <LogOut size={16} /> : <LogIn size={16} />}
                            {actionLoading ? '...' : isClockedIn ? 'Clock Out' : 'Clock In'}
                        </button>
                    )}
                    {isClockedOut && (
                        <span className="px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest rounded-xl border border-emerald-100">
                            ✓ Day Complete
                        </span>
                    )}
                </div>
            </div>

            {/* Today's Status */}
            {todayRecord && (
                <div className="bg-emerald-600 text-white p-5 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-200 mb-1">Today's Session</p>
                        <div className="flex items-center gap-6">
                            <div>
                                <p className="text-xs text-emerald-200">Clock In</p>
                                <p className="text-lg font-bold">{formatTime(todayRecord.clockIn)}</p>
                            </div>
                            {todayRecord.clockOut && (
                                <>
                                    <div className="text-emerald-300">→</div>
                                    <div>
                                        <p className="text-xs text-emerald-200">Clock Out</p>
                                        <p className="text-lg font-bold">{formatTime(todayRecord.clockOut)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-emerald-200">Total</p>
                                        <p className="text-lg font-bold">{calcHours(todayRecord.clockIn, todayRecord.clockOut)}</p>
                                    </div>
                                </>
                            )}
                            {!todayRecord.clockOut && (
                                <div>
                                    <p className="text-xs text-emerald-200">Status</p>
                                    <p className="text-lg font-bold">Active ●</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-sm">
                    <div className="p-2 bg-white/20 rounded-lg w-fit mb-4"><CheckCircle2 size={24} /></div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-100 mb-1">Present Days</p>
                    <h3 className="text-3xl font-bold">{presentDays}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="p-2 bg-rose-50 text-rose-500 rounded-lg w-fit mb-4"><AlertCircle size={24} /></div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Late Check-ins</p>
                    <h3 className="text-3xl font-bold text-slate-900">{lateDays}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="p-2 bg-slate-50 text-slate-500 rounded-lg w-fit mb-4"><Clock size={24} /></div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Avg Work Hours</p>
                    <h3 className="text-3xl font-bold text-slate-900">{avgHours} <span className="text-lg text-slate-400 font-medium">hrs/day</span></h3>
                </div>
            </div>

            {/* Records Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Recent Logs</h3>
                    <button onClick={fetchAttendance} className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg transition-colors">
                        <RefreshCw size={16} />
                    </button>
                </div>
                {loading ? (
                    <div className="p-12 text-center text-slate-400 text-sm">Loading attendance records…</div>
                ) : records.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 text-sm italic">No attendance records found. Clock in to start tracking.</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Clock In</th>
                                <th className="px-6 py-4">Clock Out</th>
                                <th className="px-6 py-4 text-right">Total Hours</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {records.map((record) => {
                                const isLate = record.clockIn && (new Date(record.clockIn).getHours() > 9 || (new Date(record.clockIn).getHours() === 9 && new Date(record.clockIn).getMinutes() > 15));
                                return (
                                    <tr key={record._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900">{formatDate(record.date)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${record.status === 'Active' ? 'bg-blue-50 text-blue-600 border-blue-100'
                                                : isLate ? 'bg-rose-50 text-rose-600 border-rose-100'
                                                    : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                }`}>
                                                {record.status === 'Active' ? 'Active' : isLate ? 'Late' : 'Present'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-600">{formatTime(record.clockIn)}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-600">{formatTime(record.clockOut)}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">{calcHours(record.clockIn, record.clockOut)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MyAttendance;
