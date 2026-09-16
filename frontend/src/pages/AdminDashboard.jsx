import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from '../components/StatCard';
import {
    Users,
    UserMinus,
    Briefcase,
    Plus,
    Clock,
    CreditCard as CardIcon,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Download,
    Filter,
    FileText,
    Settings,
    LogOut,
    Edit,
    Trash2,
    Eye,
    DollarSign,
    Calendar as CalendarIcon,
    FileDown,
    Upload,
    Shield
} from 'lucide-react';
import jsPDF from 'jspdf';

const API = 'http://localhost:5000/api';

const AdminDashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [payslips, setPayslips] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [showDepartmentModal, setShowDepartmentModal] = useState(false);
    const [showPayrollModal, setShowPayrollModal] = useState(false);
    const [showTaxSettingsModal, setShowTaxSettingsModal] = useState(false);
    const [showPayslipModal, setShowPayslipModal] = useState(false);
    const [attendanceFilter, setAttendanceFilter] = useState('all');
    const [taxSettings, setTaxSettings] = useState({
        basicSalaryTax: 10,
        hraTax: 5,
        specialAllowanceTax: 15,
        professionalTax: 200
    });
    
    // Add month/year state for payroll processing
    const [payrollPeriod, setPayrollPeriod] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    });
    const [processingPayroll, setProcessingPayroll] = useState(false);

    const [payslipForm, setPayslipForm] = useState({
        employeeId: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        basicSalary: 0,
        hra: 0,
        specialAllowance: 0,
        bonus: 0,
        deductions: 0,
        overtimeHours: 0,
        overtimeRate: 100
    });

    const [stats, setStats] = useState({
        totalEmployees: 0,
        presentToday: 0,
        pendingLeaves: 0,
        pendingExpenses: 0
    });

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            
            // Fetch all data
            const [employeesRes, attendanceRes, leavesRes, expensesRes, payslipsRes] = await Promise.all([
                axios.get(`${API}/employees`, { headers: { Authorization: `Bearer ${token}` }}),
                axios.get(`${API}/attendance`, { headers: { Authorization: `Bearer ${token}` }}),
                axios.get(`${API}/leaves`, { headers: { Authorization: `Bearer ${token}` }}),
                axios.get(`${API}/expenses`, { headers: { Authorization: `Bearer ${token}` }}),
                axios.get(`${API}/payroll`, { headers: { Authorization: `Bearer ${token}` }})
            ]);

            setEmployees(employeesRes.data);
            setAttendance(attendanceRes.data);
            setLeaves(leavesRes.data);
            setExpenses(expensesRes.data);
            setPayslips(payslipsRes.data);

            // Calculate stats
            const today = new Date().toISOString().split('T')[0];
            const presentToday = attendanceRes.data.filter(a => 
                a.dateString === today && a.status === 'Completed'
            ).length;

            setStats({
                totalEmployees: employeesRes.data.length,
                presentToday,
                pendingLeaves: leavesRes.data.filter(l => l.status === 'pending').length,
                pendingExpenses: expensesRes.data.filter(e => e.status === 'pending').length
            });

            // Extract unique departments
            const uniqueDepts = [...new Set(employeesRes.data.map(emp => emp.department).filter(Boolean))];
            setDepartments(uniqueDepts);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleApproveLeave = async (leaveId) => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            await axios.put(`${API}/leaves/${leaveId}`, { status: 'approved' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDashboardData();
        } catch (error) {
            alert('Error approving leave: ' + error.response?.data?.message);
        }
    };

    const handleRejectLeave = async (leaveId) => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            await axios.put(`${API}/leaves/${leaveId}`, { status: 'rejected' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDashboardData();
        } catch (error) {
            alert('Error rejecting leave: ' + error.response?.data?.message);
        }
    };

    const handleApproveExpense = async (expenseId) => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            await axios.put(`${API}/expenses/${expenseId}/status`, { status: 'approved' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDashboardData();
        } catch (error) {
            alert('Error approving expense: ' + error.response?.data?.message);
        }
    };

    const handleRejectExpense = async (expenseId) => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            await axios.put(`${API}/expenses/${expenseId}/status`, { status: 'rejected' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDashboardData();
        } catch (error) {
            alert('Error rejecting expense: ' + error.response?.data?.message);
        }
    };

    const handleActivateTalent = async (employeeId) => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            await axios.put(`${API}/employees/${employeeId}`, { isActive: true }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDashboardData();
        } catch (error) {
            alert('Error activating talent: ' + error.response?.data?.message);
        }
    };

    const handleDeactivateTalent = async (employeeId) => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            await axios.put(`${API}/employees/${employeeId}`, { isActive: false }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDashboardData();
        } catch (error) {
            alert('Error deactivating talent: ' + error.response?.data?.message);
        }
    };

    const handleDeleteEmployee = async (employeeId) => {
        if (!confirm('Are you sure you want to delete this employee?')) return;
        
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            await axios.delete(`${API}/employees/${employeeId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDashboardData();
        } catch (error) {
            alert('Error deleting employee: ' + error.response?.data?.message);
        }
    };

    const handleEditDepartment = async (oldDept, newDept) => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            // Update all employees in this department
            await axios.put(`${API}/employees/department`, { oldDepartment: oldDept, newDepartment: newDept }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDashboardData();
        } catch (error) {
            alert('Error updating department: ' + error.response?.data?.message);
        }
    };

    const handleDeleteDepartment = async (department) => {
        if (!confirm(`Are you sure you want to delete the ${department} department?`)) return;
        
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            await axios.delete(`${API}/employees/departments/${department}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert('Department deleted successfully!');
            fetchDashboardData();
        } catch (error) {
            alert('Error deleting department: ' + error.response?.data?.message);
        }
    };

    const handleAddDepartment = async (departmentName) => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            await axios.post(`${API}/employees/departments`, { 
                name: departmentName 
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert('Department added successfully!');
            setShowDepartmentModal(false);
            fetchDashboardData();
        } catch (error) {
            alert('Error adding department: ' + error.response?.data?.message);
        }
    };

    const handleProcessPayroll = async () => {
        console.log('Process payroll button clicked');
        console.log('Payroll period:', payrollPeriod);
        
        try {
            setProcessingPayroll(true);
            
            // Check if user is authenticated
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            console.log('User info:', userInfo);
            
            if (!userInfo.token) {
                alert('Please login to process payroll');
                setProcessingPayroll(false);
                return;
            }
            
            if (userInfo.role !== 'admin') {
                alert('Only admin can process payroll');
                setProcessingPayroll(false);
                return;
            }
            
            // Use selected period
            const month = payrollPeriod.month;
            const year = payrollPeriod.year;
            
            // Get month name for display
            const monthName = new Date(2000, month - 1, 1).toLocaleDateString('en-US', { month: 'long' });
            
            // Confirm before processing
            const confirmMessage = `Process payroll for all employees for ${monthName} ${year}?`;
            if (!confirm(confirmMessage)) {
                setProcessingPayroll(false);
                return;
            }
            
            console.log('Sending payroll request:', { month, year });
            console.log('API URL:', `${API}/payroll/generate`);
            
            const response = await axios.post(`${API}/payroll/generate`, { month, year }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            
            console.log('Payroll response:', response);
            alert(`Payroll processed successfully for ${response.data.length} employees!`);
            fetchDashboardData();
        } catch (error) {
            console.error('Payroll processing error:', error);
            console.error('Error response:', error.response);
            alert('Error processing payroll: ' + (error.response?.data?.message || error.message));
        } finally {
            setProcessingPayroll(false);
        }
    };

    // Test function to check backend connectivity
    const testBackendConnection = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            console.log('Testing backend connection...');
            console.log('Token exists:', !!userInfo.token);
            console.log('User role:', userInfo.role);
            
            if (!userInfo.token) {
                alert('No authentication token found. Please login.');
                return;
            }
            
            if (userInfo.role !== 'admin') {
                alert('You need admin privileges to access this feature.');
                return;
            }
            
            const response = await axios.get(`${API}/employees`, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            console.log('Backend connection successful, employees:', response.data.length);
            alert(`Backend is working! Found ${response.data.length} employees. You can process payroll now.`);
        } catch (error) {
            console.error('Backend connection failed:', error);
            if (error.response?.status === 401) {
                alert('Authentication failed. Please login again.');
            } else if (error.response?.status === 403) {
                alert('Access denied. Admin privileges required.');
            } else {
                alert('Backend connection failed: ' + error.message);
            }
        }
    };

    const handleDownloadStatement = (employeeId, month, year) => {
        const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
        window.open(`${API}/payroll/statement/${employeeId}/${month}/${year}?token=${token}`, '_blank');
    };

    const handleExportAttendance = () => {
        let filteredData = attendance;
        
        if (attendanceFilter !== 'all') {
            const today = new Date();
            filteredData = attendance.filter(a => {
                const attendanceDate = new Date(a.dateString || a.date);
                if (attendanceFilter === 'today') {
                    return attendanceDate.toDateString() === today.toDateString();
                }
                if (attendanceFilter === 'week') {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return attendanceDate >= weekAgo;
                }
                if (attendanceFilter === 'month') {
                    return attendanceDate.getMonth() === today.getMonth() && 
                           attendanceDate.getFullYear() === today.getFullYear();
                }
                return true;
            });
        }
        
        // Create PDF
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(20);
        doc.text('Attendance Report', 20, 20);
        
        // Add filter info
        doc.setFontSize(12);
        doc.text(`Filter: ${attendanceFilter.charAt(0).toUpperCase() + attendanceFilter.slice(1)}`, 20, 30);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 40);
        
        // Add table headers
        doc.setFontSize(10);
        let yPosition = 60;
        doc.text('Date', 20, yPosition);
        doc.text('Employee', 50, yPosition);
        doc.text('Clock In', 100, yPosition);
        doc.text('Clock Out', 140, yPosition);
        doc.text('Status', 180, yPosition);
        
        // Add table data
        yPosition += 10;
        filteredData.forEach(a => {
            const employee = employees.find(e => e._id === a.employeeId);
            const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 
                                     a.employeeId?.firstName && a.employeeId?.lastName ? 
                                     `${a.employeeId.firstName} ${a.employeeId.lastName}` : 
                                     'Employee';
            
            doc.text(a.dateString || new Date(a.date).toISOString().split('T')[0] || '-', 20, yPosition);
            doc.text(employeeName.substring(0, 20), 50, yPosition);
            doc.text(a.clockIn ? new Date(a.clockIn).toLocaleTimeString() : '-', 100, yPosition);
            doc.text(a.clockOut ? new Date(a.clockOut).toLocaleTimeString() : '-', 140, yPosition);
            doc.text(a.status || '-', 180, yPosition);
            
            yPosition += 10;
            if (yPosition > 280) {
                doc.addPage();
                yPosition = 20;
            }
        });
        
        // Save PDF
        doc.save(`attendance_report_${attendanceFilter}_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const handleUpdateTaxSettings = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            await axios.put(`${API}/settings/tax`, taxSettings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Tax settings updated successfully!');
            setShowTaxSettingsModal(false);
        } catch (error) {
            alert('Error updating tax settings: ' + error.response?.data?.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        window.location.href = '/admin-login';
    };

    const handleCreatePayslip = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            
            if (!payslipForm.employeeId) {
                alert('Please select an employee');
                return;
            }
            
            const employee = employees.find(e => e._id === payslipForm.employeeId);
            if (!employee) {
                alert('Employee not found');
                return;
            }
            
            // Auto-calculate all components based on employee salary structure
            const basicSalary = employee.salaryStructure?.baseSalary || 0;
            const allowances = employee.salaryStructure?.allowances || 0;
            const hra = allowances * 0.4; // 40% of allowances as HRA
            const specialAllowance = allowances * 0.6; // 60% as special allowance
            const overtimePay = payslipForm.overtimeHours * payslipForm.overtimeRate;
            const totalEarnings = basicSalary + hra + specialAllowance + payslipForm.bonus + overtimePay;
            const totalDeductions = payslipForm.deductions + taxSettings.professionalTax;
            const netSalary = totalEarnings - totalDeductions;
            
            // Create payslip record in backend
            const payslipData = {
                employeeId: payslipForm.employeeId,
                month: payslipForm.month,
                year: payslipForm.year,
                basicSalary,
                hra,
                specialAllowance,
                bonus: payslipForm.bonus,
                overtimePay,
                totalEarnings,
                deductions: payslipForm.deductions,
                professionalTax: taxSettings.professionalTax,
                totalDeductions,
                netSalary,
                status: 'issued'
            };
            
            // Save to backend
            await axios.post(`${API}/payroll/generate`, {
                employeeId: payslipForm.employeeId,
                month: payslipForm.month,
                year: payslipForm.year,
                bonus: payslipForm.bonus,
                ...payslipData
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert('Payslip created successfully! Employee can view and download from their dashboard.');
            setShowPayslipModal(false);
            fetchDashboardData();
            
        } catch (error) {
            alert('Error creating payslip: ' + error.response?.data?.message);
        }
    };

    const handleEmployeeSelection = (employeeId) => {
        const employee = employees.find(e => e._id === employeeId);
        if (employee) {
            setPayslipForm({
                ...payslipForm,
                employeeId,
                basicSalary: employee.salaryStructure?.baseSalary || 0,
                hra: (employee.salaryStructure?.allowances || 0) * 0.4,
                specialAllowance: (employee.salaryStructure?.allowances || 0) * 0.6
            });
        }
    };

    const handleAddEmployee = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            // Get form values from the modal
            const form = document.querySelector('#addEmployeeForm');
            if (!form) {
                alert('Form not found');
                return;
            }
            
            const formData = new FormData(form);
            const employeeData = {
                firstName: formData.get('firstName') || document.querySelector('input[placeholder="First Name"]').value,
                lastName: formData.get('lastName') || document.querySelector('input[placeholder="Last Name"]').value,
                email: formData.get('email') || document.querySelector('input[type="email"]').value,
                phone: formData.get('phone') || document.querySelector('input[type="tel"]').value,
                department: formData.get('department') || document.querySelector('select').value,
                designation: formData.get('designation') || document.querySelector('input[placeholder="Designation"]').value,
                salaryStructure: {
                    baseSalary: parseFloat(formData.get('baseSalary') || document.querySelector('input[placeholder="Base Salary"]').value) || 0,
                    allowances: parseFloat(formData.get('allowances') || document.querySelector('input[placeholder="Allowances"]').value) || 0,
                    deductions: 0
                }
            };
            
            await axios.post(`${API}/employees`, employeeData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert('Employee added successfully!');
            setShowEmployeeModal(false);
            fetchDashboardData();
            
        } catch (error) {
            alert('Error adding employee: ' + error.response?.data?.message);
        }
    };

    const downloadExpenseReceipt = (expenseId, filename) => {
        const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
        window.open(`${API}/expenses/receipt/${expenseId}?token=${token}`, '_blank');
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
            {/* Header */}
            <div className="card-classic p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                        <p className="text-slate-600 mt-1">Manage employees, payroll, and system operations</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit">
                {['overview', 'employees', 'departments', 'attendance', 'financial', 'settings'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-md text-sm font-bold capitalize transition-all ${
                            activeTab === tab 
                                ? 'bg-white text-emerald-600 shadow-sm' 
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <>
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Total Employees" value={stats.totalEmployees} icon={<Users size={20} />} trendValue="Active" />
                        <StatCard title="Present Today" value={stats.presentToday} icon={<CheckCircle2 size={20} />} trendValue="On Time" />
                        <StatCard title="Pending Leaves" value={stats.pendingLeaves} icon={<UserMinus size={20} />} trendValue="Review" />
                        <StatCard title="Pending Expenses" value={stats.pendingExpenses} icon={<CardIcon size={20} />} trendValue="Action" />
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Leaves */}
                        <div className="card-classic p-8">
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6">Recent Leave Requests</h2>
                            <div className="space-y-4">
                                {leaves.slice(0, 5).map((leave) => {
                                    const employee = employees.find(e => e._id === leave.employee);
                                    return (
                                        <div key={leave._id} className="p-4 border border-slate-100 rounded-lg bg-slate-50">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">
                                                        {employee?.firstName} {employee?.lastName}
                                                    </p>
                                                    <p className="text-xs text-slate-500">{leave.type}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 text-[10px] font-bold rounded ${
                                                        leave.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                                                        leave.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                                        'bg-orange-50 text-orange-600'
                                                    }`}>
                                                        {leave.status}
                                                    </span>
                                                    {leave.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApproveLeave(leave._id)}
                                                                className="p-1 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200"
                                                            >
                                                                <CheckCircle2 size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleRejectLeave(leave._id)}
                                                                className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                                            >
                                                                <XCircle size={14} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Recent Expenses */}
                        <div className="card-classic p-8">
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6">Recent Expense Claims</h2>
                            <div className="space-y-4">
                                {expenses.slice(0, 5).map((expense) => {
                                    const employee = employees.find(e => e._id === expense.employee);
                                    return (
                                        <div key={expense._id} className="p-4 border border-slate-100 rounded-lg bg-slate-50">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">
                                                        {employee?.firstName} {employee?.lastName}
                                                    </p>
                                                    <p className="text-xs text-slate-500">{expense.title}</p>
                                                    <p className="text-xs text-slate-500">₹{expense.amount.toLocaleString('en-IN')}</p>
                                                    {expense.receiptUrl && (
                                                        <button
                                                            onClick={() => downloadExpenseReceipt(expense._id, expense.receiptUrl)}
                                                            className="text-xs text-blue-600 hover:underline mt-1"
                                                        >
                                                            View Receipt
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 text-[10px] font-bold rounded ${
                                                        expense.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                                                        expense.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                                        'bg-orange-50 text-orange-600'
                                                    }`}>
                                                        {expense.status}
                                                    </span>
                                                    {expense.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApproveExpense(expense._id)}
                                                                className="p-1 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200"
                                                            >
                                                                <CheckCircle2 size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleRejectExpense(expense._id)}
                                                                className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                                            >
                                                                <XCircle size={14} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Employees Tab */}
            {activeTab === 'employees' && (
                <div className="card-classic p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Employee Management</h2>
                        <button
                            onClick={() => setShowEmployeeModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            <Plus size={18} />
                            Add Employee
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    <th className="pb-4">Name</th>
                                    <th className="pb-4">Email</th>
                                    <th className="pb-4">Department</th>
                                    <th className="pb-4">Position</th>
                                    <th className="pb-4">Status</th>
                                    <th className="pb-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {employees.map((employee) => (
                                    <tr key={employee._id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4">
                                            <p className="text-sm font-bold text-slate-900">
                                                {employee.firstName} {employee.lastName}
                                            </p>
                                        </td>
                                        <td className="py-4 text-sm text-slate-600">{employee.email}</td>
                                        <td className="py-4 text-sm text-slate-600">{employee.department || '-'}</td>
                                        <td className="py-4 text-sm text-slate-600">{employee.designation || '-'}</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 text-[10px] font-bold rounded ${
                                                employee.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                                {employee.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2">
                                                {employee.isActive ? (
                                                    <button
                                                        onClick={() => handleDeactivateTalent(employee._id)}
                                                        className="p-1 bg-orange-100 text-orange-600 rounded hover:bg-orange-200"
                                                        title="Deactivate"
                                                    >
                                                        <UserMinus size={14} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleActivateTalent(employee._id)}
                                                        className="p-1 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200"
                                                        title="Activate"
                                                    >
                                                        <CheckCircle2 size={14} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteEmployee(employee._id)}
                                                    className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Departments Tab */}
            {activeTab === 'departments' && (
                <div className="card-classic p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Department Management</h2>
                        <button
                            onClick={() => setShowDepartmentModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            <Plus size={18} />
                            Add Department
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {departments.map((dept) => {
                            const deptEmployees = employees.filter(e => e.department === dept);
                            return (
                                <div key={dept} className="p-6 border border-slate-100 rounded-lg bg-slate-50">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-slate-900">{dept}</h3>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    const newName = prompt(`Edit department name:`, dept);
                                                    if (newName && newName !== dept) {
                                                        handleEditDepartment(dept, newName);
                                                    }
                                                }}
                                                className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                                                title="Edit"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteDepartment(dept)}
                                                className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600">{deptEmployees.length} employees</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Attendance Tab */}
            {activeTab === 'attendance' && (
                <div className="card-classic p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Attendance Management</h2>
                        <div className="flex items-center gap-4">
                            <select
                                value={attendanceFilter}
                                onChange={(e) => setAttendanceFilter(e.target.value)}
                                className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                            >
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                            </select>
                            <button
                                onClick={handleExportAttendance}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                <Download size={18} />
                                Export Report
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    <th className="pb-4">Date</th>
                                    <th className="pb-4">Employee</th>
                                    <th className="pb-4">Clock In</th>
                                    <th className="pb-4">Clock Out</th>
                                    <th className="pb-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {attendance
                                    .filter(a => {
                                        if (attendanceFilter === 'all') return true;
                                        const today = new Date();
                                        const attendanceDate = new Date(a.dateString || a.date);
                                        if (attendanceFilter === 'today') {
                                            return attendanceDate.toDateString() === today.toDateString();
                                        }
                                        if (attendanceFilter === 'week') {
                                            const weekAgo = new Date();
                                            weekAgo.setDate(weekAgo.getDate() - 7);
                                            return attendanceDate >= weekAgo;
                                        }
                                        if (attendanceFilter === 'month') {
                                            return attendanceDate.getMonth() === today.getMonth() && 
                                                   attendanceDate.getFullYear() === today.getFullYear();
                                        }
                                        return true;
                                    })
                                    .slice(0, 20)
                                    .map((record) => {
                                        const employee = employees.find(e => e._id === record.employeeId);
                                        return (
                                            <tr key={record._id} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="py-4 text-sm text-slate-600">{record.dateString || new Date(record.date).toISOString().split('T')[0]}</td>
                                                <td className="py-4 text-sm font-bold text-slate-900">
                                                    {employee ? `${employee.firstName} ${employee.lastName}` : 
                                                     record.employeeId?.firstName && record.employeeId?.lastName ? 
                                                     `${record.employeeId.firstName} ${record.employeeId.lastName}` : 
                                                     'Employee'}
                                                </td>
                                                <td className="py-4 text-sm text-slate-600">
                                                    {record.clockIn ? new Date(record.clockIn).toLocaleTimeString() : '-'}
                                                </td>
                                                <td className="py-4 text-sm text-slate-600">
                                                    {record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : '-'}
                                                </td>
                                                <td className="py-4">
                                                    <span className={`px-2 py-1 text-[10px] font-bold rounded ${
                                                        record.status === 'Active' ? 'bg-blue-50 text-blue-600' :
                                                        record.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                                                        'bg-slate-50 text-slate-500'
                                                    }`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Financial Tab */}
            {activeTab === 'financial' && (
                <div className="space-y-8">
                    {/* Payroll Processing */}
                    <div className="card-classic p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Payroll Processing</h2>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <select
                                        value={payrollPeriod.month}
                                        onChange={(e) => setPayrollPeriod({...payrollPeriod, month: parseInt(e.target.value)})}
                                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                    >
                                        {[1,2,3,4,5,6,7,8,9,10,11,12].map(month => (
                                            <option key={month} value={month}>
                                                {new Date(2000, month-1, 1).toLocaleDateString('en-US', { month: 'short' })}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={payrollPeriod.year}
                                        onChange={(e) => setPayrollPeriod({...payrollPeriod, year: parseInt(e.target.value)})}
                                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                    >
                                        {[2023, 2024, 2025, 2026, 2027].map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={() => {
                                        console.log('Button clicked directly');
                                        handleProcessPayroll();
                                    }}
                                    disabled={processingPayroll}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <DollarSign size={18} />
                                    {processingPayroll ? 'Processing...' : 'Process Payroll'}
                                </button>
                                <button
                                    onClick={testBackendConnection}
                                    className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                                >
                                    Test Backend
                                </button>
                                <button
                                    onClick={() => setShowPayslipModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                    <Plus size={18} />
                                    Issue Payslip
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {employees.map((employee) => (
                                <div key={employee._id} className="p-6 border border-slate-100 rounded-lg bg-slate-50">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-slate-900">
                                            {employee.firstName} {employee.lastName}
                                        </h3>
                                        <button
                                            onClick={() => handleDownloadStatement(employee._id, payrollPeriod.month, payrollPeriod.year)}
                                            className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                                            title="Download Statement"
                                        >
                                            <FileDown size={14} />
                                        </button>
                                    </div>
                                    <p className="text-sm text-slate-600">{employee.department}</p>
                                    <p className="text-sm text-slate-600">{employee.designation}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payslips Management */}
                    <div className="card-classic p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Payslips Management</h2>
                            <button
                                onClick={() => setShowPayrollModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                <Plus size={18} />
                                Issue Payslip
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                        <th className="pb-4">Employee</th>
                                        <th className="pb-4">Month</th>
                                        <th className="pb-4">Year</th>
                                        <th className="pb-4">Basic Salary</th>
                                        <th className="pb-4">Net Salary</th>
                                        <th className="pb-4">Status</th>
                                        <th className="pb-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {payslips.map((payslip) => {
                                        const employee = employees.find(e => e._id === payslip.employee);
                                        return (
                                            <tr key={payslip._id} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="py-4 text-sm font-bold text-slate-900">
                                                    {employee?.firstName} {employee?.lastName}
                                                </td>
                                                <td className="py-4 text-sm text-slate-600">
                                                    {new Date(2000, payslip.month - 1, 1).toLocaleDateString('en-US', { month: 'long' })}
                                                </td>
                                                <td className="py-4 text-sm text-slate-600">{payslip.year}</td>
                                                <td className="py-4 text-sm text-slate-600">₹{payslip.basicSalary?.toLocaleString('en-IN') || 0}</td>
                                                <td className="py-4 text-sm text-slate-600">₹{payslip.netSalary?.toLocaleString('en-IN') || 0}</td>
                                                <td className="py-4">
                                                    <span className={`px-2 py-1 text-[10px] font-bold rounded ${
                                                        payslip.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                                                        payslip.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                                                        'bg-slate-50 text-slate-500'
                                                    }`}>
                                                        {payslip.status}
                                                    </span>
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => window.open(`${API}/payroll/payslip/${payslip._id}?token=${JSON.parse(localStorage.getItem('userInfo') || '{}').token}`, '_blank')}
                                                            className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                                                            title="Preview"
                                                        >
                                                            <Eye size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => window.open(`${API}/payroll/download/${payslip._id}?token=${JSON.parse(localStorage.getItem('userInfo') || '{}').token}`, '_blank')}
                                                            className="p-1 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200"
                                                            title="Download"
                                                        >
                                                            <Download size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="card-classic p-8">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6">Tax Settings</h2>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Basic Salary Tax (%)</label>
                                <input
                                    type="number"
                                    value={taxSettings.basicSalaryTax}
                                    onChange={(e) => setTaxSettings({...taxSettings, basicSalaryTax: parseFloat(e.target.value)})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">HRA Tax (%)</label>
                                <input
                                    type="number"
                                    value={taxSettings.hraTax}
                                    onChange={(e) => setTaxSettings({...taxSettings, hraTax: parseFloat(e.target.value)})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Special Allowance Tax (%)</label>
                                <input
                                    type="number"
                                    value={taxSettings.specialAllowanceTax}
                                    onChange={(e) => setTaxSettings({...taxSettings, specialAllowanceTax: parseFloat(e.target.value)})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Professional Tax (₹)</label>
                                <input
                                    type="number"
                                    value={taxSettings.professionalTax}
                                    onChange={(e) => setTaxSettings({...taxSettings, professionalTax: parseFloat(e.target.value)})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleUpdateTaxSettings}
                            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            Update Tax Settings
                        </button>
                    </div>
                </div>
            )}

            {/* Payslip Creation Modal */}
            {showPayslipModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Create Payslip</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Employee</label>
                                <select
                                    value={payslipForm.employeeId}
                                    onChange={(e) => handleEmployeeSelection(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map((emp) => (
                                        <option key={emp._id} value={emp._id}>
                                            {emp.firstName} {emp.lastName} - {emp.department}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Month</label>
                                <select
                                    value={payslipForm.month}
                                    onChange={(e) => setPayslipForm({...payslipForm, month: parseInt(e.target.value)})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                >
                                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(month => (
                                        <option key={month} value={month}>
                                            {new Date(2000, month-1, 1).toLocaleDateString('en-US', { month: 'long' })}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Year</label>
                                <select
                                    value={payslipForm.year}
                                    onChange={(e) => setPayslipForm({...payslipForm, year: parseInt(e.target.value)})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                >
                                    {[2023, 2024, 2025, 2026, 2027].map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Basic Salary (₹)</label>
                                <input
                                    type="number"
                                    value={payslipForm.basicSalary}
                                    readOnly
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                                    placeholder="Auto-calculated"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">HRA (₹)</label>
                                <input
                                    type="number"
                                    value={payslipForm.hra}
                                    readOnly
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                                    placeholder="Auto-calculated"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Special Allowance (₹)</label>
                                <input
                                    type="number"
                                    value={payslipForm.specialAllowance}
                                    readOnly
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                                    placeholder="Auto-calculated"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Bonus (₹)</label>
                                <input
                                    type="number"
                                    value={payslipForm.bonus}
                                    onChange={(e) => setPayslipForm({...payslipForm, bonus: parseFloat(e.target.value) || 0})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Other Deductions (₹)</label>
                                <input
                                    type="number"
                                    value={payslipForm.deductions}
                                    onChange={(e) => setPayslipForm({...payslipForm, deductions: parseFloat(e.target.value) || 0})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Overtime Hours</label>
                                <input
                                    type="number"
                                    value={payslipForm.overtimeHours}
                                    onChange={(e) => setPayslipForm({...payslipForm, overtimeHours: parseFloat(e.target.value) || 0})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Overtime Rate (₹/hr)</label>
                                <input
                                    type="number"
                                    value={payslipForm.overtimeRate}
                                    onChange={(e) => setPayslipForm({...payslipForm, overtimeRate: parseFloat(e.target.value) || 0})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => setShowPayslipModal(false)}
                                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreatePayslip}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                Create Payslip
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Employee Modal */}
            {showEmployeeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <form id="addEmployeeForm">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Add New Employee</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                                <input
                                    name="firstName"
                                    type="text"
                                    placeholder="First Name"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                                <input
                                    name="lastName"
                                    type="text"
                                    placeholder="Last Name"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Phone</label>
                                <input
                                    name="phone"
                                    type="tel"
                                    placeholder="Phone"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Department</label>
                                <select name="department" className="w-full px-3 py-2 border border-slate-200 rounded-lg">
                                    <option value="">Select Department</option>
                                    {departments.map((dept) => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Designation</label>
                                <input
                                    name="designation"
                                    type="text"
                                    placeholder="Designation"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Base Salary (₹)</label>
                                <input
                                    name="baseSalary"
                                    type="number"
                                    placeholder="Base Salary"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Allowances (₹)</label>
                                <input
                                    name="allowances"
                                    type="number"
                                    placeholder="Allowances"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setShowEmployeeModal(false)}
                                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleAddEmployee}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                Add Employee
                            </button>
                        </div>
                    </form>
                    </div>
                </div>
            )}

            {/* Add Department Modal */}
            {showDepartmentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Add New Department</h2>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Department Name</label>
                            <input
                                id="departmentName"
                                type="text"
                                placeholder="Enter department name"
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowDepartmentModal(false)}
                                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    const deptName = document.getElementById('departmentName').value;
                                    if (deptName.trim()) {
                                        handleAddDepartment(deptName.trim());
                                    } else {
                                        alert('Please enter a department name');
                                    }
                                }}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                Add Department
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
