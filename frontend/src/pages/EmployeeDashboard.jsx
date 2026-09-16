import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from '../components/StatCard';
import {
    Calendar,
    CreditCard,
    Award,
    Zap,
    Clock,
    CheckCircle2,
    UserMinus,
    Download,
    Eye,
    FileText
} from 'lucide-react';

const API = 'http://localhost:5000/api';

const EmployeeDashboard = () => {
    const [user, setUser] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    const fetchEmployeeData = async () => {
        try {
            setLoading(true);
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            
            // Fetch all employee data
            const [attendanceRes, leavesRes, expensesRes, payslipsRes, profileRes] = await Promise.all([
                axios.get(`${API}/attendance/my`, { headers: { Authorization: `Bearer ${token}` }}),
                axios.get(`${API}/leaves/my`, { headers: { Authorization: `Bearer ${token}` }}),
                axios.get(`${API}/expenses/my`, { headers: { Authorization: `Bearer ${token}` }}),
                axios.get(`${API}/payroll/my`, { headers: { Authorization: `Bearer ${token}` }}),
                axios.get(`${API}/employees/profile`, { headers: { Authorization: `Bearer ${token}` }})
            ]);

            setAttendance(attendanceRes.data);
            setLeaves(leavesRes.data);
            setExpenses(expensesRes.data);
            setPayslips(payslipsRes.data);
            setUser(profileRes.data);
        } catch (error) {
            console.error('Error fetching employee data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
        if (token) {
            fetchEmployeeData();
            // Set up real-time updates
            const interval = setInterval(() => {
                fetchEmployeeData();
                setCurrentTime(new Date());
            }, 30000);
            return () => clearInterval(interval);
        }
    }, []);

    // Update clock every second
    useEffect(() => {
        const clockInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(clockInterval);
    }, []);

    const clockIn = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            await axios.post(`${API}/attendance/clockin`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchEmployeeData();
        } catch (error) {
            console.error('Error clocking in:', error);
            alert(error.response?.data?.message || 'Error clocking in');
        }
    };

    const clockOut = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            await axios.put(`${API}/attendance/clockout`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchEmployeeData();
        } catch (error) {
            console.error('Error clocking out:', error);
            alert(error.response?.data?.message || 'Error clocking out');
        }
    };

    const hasActiveClockIn = attendance.some(a => a.status === 'Active');

    const handlePreviewPayslip = (payslipId) => {
        const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
        window.open(`${API}/payroll/payslip/${payslipId}?token=${token}`, '_blank');
    };

    const handleDownloadPayslip = (payslipId) => {
        const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
        window.open(`${API}/payroll/download/${payslipId}?token=${token}`, '_blank');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-slate-600">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Welcome Header */}
            <div className="card-classic p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Welcome back, {user?.firstName || 'Employee'}! 👋
                        </h1>
                        <p className="text-slate-600 mt-1">
                            {user?.department} • {user?.designation}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-emerald-600">
                            {currentTime.toLocaleTimeString('en-IN', { 
                                hour: '2-digit', 
                                minute: '2-digit', 
                                hour12: true 
                            })}
                        </div>
                        <p className="text-sm text-slate-500">
                            {currentTime.toLocaleDateString('en-IN', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="This Month's Payslip" value={payslips.length} icon={<CreditCard size={20} />} trendValue="Available" />
                <StatCard title="Attendance Rate" value={`${attendance.filter(a => a.status === 'Completed').length}/${attendance.length}`} icon={<Calendar size={20} />} trendValue="Good" />
                <StatCard title="Pending Leaves" value={leaves.filter(l => l.status === 'pending').length} icon={<UserMinus size={20} />} trendValue="Active" />
                <StatCard title="Expense Claims" value={expenses.filter(e => e.status === 'pending').length} icon={<Award size={20} />} trendValue="Review" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Time Sheet */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Time Sheet */}
                    <div className="card-classic p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Time Sheet Log</h2>
                                <p className="text-xs text-slate-400 font-medium">Daily attendance tracking</p>
                            </div>
                            <div className="flex bg-slate-100 p-1 rounded-md">
                                <button className={`px-4 py-1.5 text-[10px] font-bold rounded transition-all ${
                                    hasActiveClockIn 
                                    ? 'bg-red-600 text-white hover:bg-red-700' 
                                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                }`}
                                    onClick={hasActiveClockIn ? clockOut : clockIn}
                                >
                                    {hasActiveClockIn ? 'Clock Out' : 'Clock In'}
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                        <th className="pb-4">Date</th>
                                        <th className="pb-4">Clock In</th>
                                        <th className="pb-4">Clock Out</th>
                                        <th className="pb-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {attendance.slice(0, 7).map((record) => (
                                        <tr key={record._id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4">
                                                <p className="text-sm font-bold text-slate-900">
                                                    {new Date(record.date).toLocaleDateString('en-IN', { 
                                                        day: 'numeric', 
                                                        month: 'short', 
                                                        year: 'numeric' 
                                                    })}
                                                </p>
                                            </td>
                                            <td className="py-4 text-sm font-bold text-slate-600">
                                                {record.clockIn ? new Date(record.clockIn).toLocaleTimeString('en-IN', { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit', 
                                                    hour12: true 
                                                }) : '--:--'}
                                            </td>
                                            <td className="py-4 text-sm font-bold text-slate-600">
                                                {record.clockOut ? new Date(record.clockOut).toLocaleTimeString('en-IN', { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit', 
                                                    hour12: true 
                                                }) : '--:--'}
                                            </td>
                                            <td className="py-4">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${
                                                    record.status === 'Active' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    record.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    'bg-slate-50 text-slate-500 border-slate-100'
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

                    {/* Recent Activity */}
                    <div className="card-classic p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent Activity</h2>
                                <p className="text-xs text-slate-400 font-medium">Your latest requests</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Recent Leaves */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                    <Calendar size={16} />
                                    Recent Leaves
                                </h3>
                                <div className="space-y-3">
                                    {leaves.slice(0, 3).map((leave) => (
                                        <div key={leave._id} className="p-4 border border-slate-100 rounded-lg bg-slate-50">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{leave.type}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-1 text-[10px] font-bold rounded ${
                                                    leave.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                                                    leave.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                                    'bg-orange-50 text-orange-600'
                                                }`}>
                                                    {leave.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Expenses */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                    <Award size={16} />
                                    Recent Expenses
                                </h3>
                                <div className="space-y-3">
                                    {expenses.slice(0, 3).map((expense) => (
                                        <div key={expense._id} className="p-4 border border-slate-100 rounded-lg bg-slate-50">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{expense.title}</p>
                                                    <p className="text-xs text-slate-500">₹{expense.amount.toLocaleString('en-IN')}</p>
                                                </div>
                                                <span className={`px-2 py-1 text-[10px] font-bold rounded ${
                                                    expense.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                                                    expense.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                                    'bg-orange-50 text-orange-600'
                                                }`}>
                                                    {expense.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Quick Actions */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Quick Actions */}
                    <div className="card-classic p-8">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6">Quick Actions</h2>
                        <div className="space-y-4">
                            <button
                                onClick={() => window.location.href = '/my-payslips'}
                                className="w-full flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors text-left"
                            >
                                <CreditCard size={18} />
                                <div className="text-left">
                                    <p className="text-sm font-bold">My Payslips</p>
                                    <p className="text-xs opacity-75">View & Download</p>
                                </div>
                            </button>
                            <button
                                onClick={() => window.location.href = '/leaves'}
                                className="w-full flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors text-left"
                            >
                                <Calendar size={18} />
                                <div className="text-left">
                                    <p className="text-sm font-bold">Apply Leave</p>
                                    <p className="text-xs opacity-75">Submit Request</p>
                                </div>
                            </button>
                            <button
                                onClick={() => window.location.href = '/my-expenses'}
                                className="w-full flex items-center gap-3 p-4 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors text-left"
                            >
                                <Award size={18} />
                                <div className="text-left">
                                    <p className="text-sm font-bold">My Expenses</p>
                                    <p className="text-xs opacity-75">Submit Claims</p>
                                </div>
                            </button>
                            <button
                                onClick={() => window.location.href = '/profile'}
                                className="w-full flex items-center gap-3 p-4 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition-colors text-left"
                            >
                                <Zap size={18} />
                                <div className="text-left">
                                    <p className="text-sm font-bold">My Profile</p>
                                    <p className="text-xs opacity-75">Edit Details</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
