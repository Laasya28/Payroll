import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Calendar,
    FileText,
    CreditCard,
    Calculator,
    Settings,
    LogOut,
    Plus,
    CircleDollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const adminLinks = [
        { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/dashboard' },
        { icon: <Users size={20} />, label: 'Employees', path: '/employees' },
        { icon: <Briefcase size={20} />, label: 'Departments', path: '/departments' },
        { icon: <Calendar size={20} />, label: 'Attendance', path: '/attendance' },
        { icon: <FileText size={20} />, label: 'Payroll', path: '/payroll' },
        { icon: <CreditCard size={20} />, label: 'Expenses', path: '/expenses' },
        { icon: <Calculator size={20} />, label: 'Tax Settings', path: '/tax' },
        { icon: <Settings size={20} />, label: 'System Settings', path: '/settings' },
    ];

    const employeeLinks = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <FileText size={20} />, label: 'My Payslips', path: '/my-payslips' },
        { icon: <Calendar size={20} />, label: 'My Attendance', path: '/my-attendance' },
        { icon: <Briefcase size={20} />, label: 'Apply Leave', path: '/leaves' },
        { icon: <CreditCard size={20} />, label: 'My Expenses', path: '/my-expenses' },
    ];

    const links = user?.role === 'admin' ? adminLinks : employeeLinks;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="fixed top-0 left-0 z-50 flex flex-col h-screen bg-white border-r w-72 border-slate-200">
            <div className="p-8">
                <div className="flex items-center gap-3 mb-10">
                    <div className="flex items-center justify-center w-10 h-10 text-xl font-bold text-white rounded-lg shadow-lg bg-emerald-600 shadow-emerald-200">PH</div>
                    <div>
                        <h1 className="text-xl font-bold leading-none tracking-tight text-slate-900">PayRollHub</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Enterprise Professional</p>
                    </div>
                </div>

                <nav className="flex flex-col space-y-2">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${location.pathname === link.path
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <span className={location.pathname === link.path ? 'text-emerald-600' : 'text-slate-400'}>
                                {link.icon}
                            </span>
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="p-8 mt-auto space-y-6">
                {/* <div className="p-6 card-classic bg-slate-50 border-slate-100">
                    <h4 className="mb-2 text-xs font-bold tracking-wide uppercase text-slate-900">Hub Support</h4>
                    <p className="text-[10px] font-medium text-slate-500 leading-relaxed mb-4">
                        Need assistance? Contact our 24/7 support line for enterprise accounts.
                    </p>
                    <button className="w-full bg-emerald-600 text-white rounded-md py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-colors">
                        Contact Support
                    </button>
                </div> */}

                <button
                    onClick={handleLogout}
                    className="flex items-center w-full gap-3 px-4 py-3 text-sm font-semibold text-red-500 transition-all rounded-md hover:bg-red-50"
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
