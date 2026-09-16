import React from 'react';
import { Calendar, Download, Filter } from 'lucide-react';

const AdminAttendance = () => {
    const records = [
        { id: 1, name: 'John Doe', date: 'Feb 26, 2026', dept: 'Engineering', in: '09:00 AM', status: 'Present' },
        { id: 2, name: 'Jane Smith', date: 'Feb 26, 2026', dept: 'Marketing', in: '09:15 AM', status: 'Late' },
        { id: 3, name: 'Mike Ross', date: 'Feb 26, 2026', dept: 'HR', in: '-', status: 'Absent' },
        { id: 4, name: 'Sarah Chen', date: 'Feb 26, 2026', dept: 'Engineering', in: '08:50 AM', status: 'Present' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Organization Attendance</h2>
                    <p className="text-xs text-slate-400 font-medium">Daily clock-in logs across all departments</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-600 flex items-center gap-2 hover:bg-slate-50">
                        <Filter size={16} /> Filter
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <Download size={16} /> Export Report
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <th className="px-6 py-4">Employee</th>
                            <th className="px-6 py-4">Department</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Clock In</th>
                            <th className="px-6 py-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {records.map(record => (
                            <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-bold text-slate-900">{record.name}</td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{record.dept}</span>
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-slate-600">{record.date}</td>
                                <td className="px-6 py-4 text-sm font-semibold text-slate-600">{record.in}</td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${record.status === 'Present' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            record.status === 'Late' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                'bg-rose-50 text-rose-600 border-rose-100'
                                        }`}>
                                        {record.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminAttendance;
