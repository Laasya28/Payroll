import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, MoreHorizontal, Mail, Phone, UserCheck, X, Download, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        salaryStructure: {
            baseSalary: 30000,
            allowances: 10000,
            deductions: 2000
        }
    });

    const API = 'http://localhost:5000/api';

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setFetching(true);
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            const response = await axios.get(`${API}/employees`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            // Fallback to empty array if API fails
            setEmployees([]);
        } finally {
            setFetching(false);
        }
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        
        if (!formData.firstName || !formData.lastName || !formData.email) {
            alert('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            await axios.post(`${API}/employees`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert('Employee added successfully!');
            setShowAddModal(false);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                department: '',
                designation: '',
                salaryStructure: {
                    baseSalary: 30000,
                    allowances: 10000,
                    deductions: 2000
                }
            });
            fetchEmployees();
        } catch (error) {
            console.error('Error adding employee:', error);
            alert(error.response?.data?.message || 'Error adding employee');
        } finally {
            setLoading(false);
        }
    };

    const handleExportEmployees = () => {
        // Filter employees based on search term
        const filteredData = employees.filter(emp =>
            `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.designation?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Create CSV content
        const headers = ['Name', 'Email', 'Phone', 'Department', 'Designation', 'Status', 'Joining Date'];
        const csvContent = [
            headers.join(','),
            ...filteredData.map(emp => [
                `${emp.firstName} ${emp.lastName}`,
                emp.email || '',
                emp.phone || '',
                emp.department || '',
                emp.designation || '',
                emp.status || 'active',
                new Date(emp.joiningDate || emp.createdAt).toLocaleDateString()
            ].join(','))
        ].join('\n');

        // Create and download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `employees_report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const filteredEmployees = employees.filter(emp =>
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.designation?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10">
            <header className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-black text-text tracking-tighter">Team Directory</h1>
                    <p className="text-gray-400 font-bold mt-2">Managing {filteredEmployees.length} of {employees.length} professional profiles across the organization.</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center gap-2 font-black py-3 px-6 shadow-xl shadow-primary/20"
                >
                    <Plus size={18} /> Add Talent
                </button>
            </header>

            <div className="glass-card overflow-hidden border-gray-100 bg-white">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div className="relative w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text" placeholder="Search by name, email, department, designation..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-10 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-bold"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <XCircle size={16} />
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-sm text-gray-500 font-bold">
                            {searchTerm && `Found: ${filteredEmployees.length} results`}
                        </div>
                        <button
                            onClick={handleExportEmployees}
                            className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-black text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={employees.length === 0}
                        >
                            <Download size={18} />
                            Export Report
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {fetching ? (
                        <div className="p-16 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <p className="mt-4 text-gray-500 font-bold">Loading employees...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black tracking-widest uppercase">
                                    <th className="px-8 py-5">Profile Entity</th>
                                    <th className="px-8 py-5">Departmental Unit</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Records</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredEmployees.length === 0 && searchTerm ? (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-16 text-center">
                                            <Search size={48} className="text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500 font-bold">No employees found</p>
                                            <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms</p>
                                        </td>
                                    </tr>
                                ) : filteredEmployees.length === 0 && !searchTerm ? (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-16 text-center">
                                            <p className="text-gray-500 font-bold">No employees found</p>
                                            <p className="text-gray-400 text-sm mt-2">Add your first employee to get started</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredEmployees.map((emp) => (
                                        <tr key={emp._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black shadow-inner">
                                                        {emp.firstName[0]}{emp.lastName[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-text">{emp.firstName} {emp.lastName}</p>
                                                        <p className="text-xs text-gray-400 font-bold mt-0.5 uppercase tracking-tighter">{emp.designation}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[10px] font-black text-accent bg-accent/5 px-3 py-1.5 rounded-lg border border-accent/10 uppercase tracking-widest">{emp.department}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${emp.status === 'active' ? 'bg-primary' : 'bg-secondary'}`}></div>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{emp.status || 'active'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="p-3 text-gray-300 hover:text-primary hover:bg-white rounded-xl transition-all shadow-sm opacity-0 group-hover:opacity-100">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Add Employee Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-black text-text">Add New Talent</h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleAddEmployee} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="john@company.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.department}
                                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Engineering"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Designation</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.designation}
                                        onChange={(e) => setFormData({...formData, designation: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Senior Developer"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Base Salary</label>
                                        <input
                                            type="number"
                                            value={formData.salaryStructure.baseSalary}
                                            onChange={(e) => setFormData({
                                                ...formData, 
                                                salaryStructure: {...formData.salaryStructure, baseSalary: Number(e.target.value)}
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="30000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Allowances</label>
                                        <input
                                            type="number"
                                            value={formData.salaryStructure.allowances}
                                            onChange={(e) => setFormData({
                                                ...formData, 
                                                salaryStructure: {...formData.salaryStructure, allowances: Number(e.target.value)}
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="10000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Deductions</label>
                                        <input
                                            type="number"
                                            value={formData.salaryStructure.deductions}
                                            onChange={(e) => setFormData({
                                                ...formData, 
                                                salaryStructure: {...formData.salaryStructure, deductions: Number(e.target.value)}
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="2000"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 btn-primary py-3 font-bold disabled:opacity-50"
                                    >
                                        {loading ? 'Adding...' : 'Add Employee'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Employees;
