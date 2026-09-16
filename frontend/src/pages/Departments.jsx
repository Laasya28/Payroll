import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Users, Plus, Edit2, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [newDepartmentName, setNewDepartmentName] = useState('');

    const API = 'http://localhost:5000/api';

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        setFetching(true);
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            const response = await axios.get(`${API}/employees`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Extract unique departments and count employees
            const deptMap = {};
            response.data.forEach(emp => {
                if (emp.department) {
                    if (!deptMap[emp.department]) {
                        deptMap[emp.department] = {
                            name: emp.department,
                            employees: 0,
                            employeeList: []
                        };
                    }
                    deptMap[emp.department].employees++;
                    deptMap[emp.department].employeeList.push(emp);
                }
            });
            
            setDepartments(Object.values(deptMap));
        } catch (error) {
            console.error('Error fetching departments:', error);
            setDepartments([]);
        } finally {
            setFetching(false);
        }
    };

    const handleAddDepartment = async () => {
        if (!newDepartmentName.trim()) {
            alert('Please enter a department name');
            return;
        }

        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            await axios.post(`${API}/employees/departments`, { name: newDepartmentName.trim() }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert('Department added successfully! Note: The department will appear in the list when employees are added to it.');
            setShowAddModal(false);
            setNewDepartmentName('');
            fetchDepartments();
        } catch (error) {
            console.error('Error adding department:', error);
            alert(error.response?.data?.message || 'Error adding department');
        } finally {
            setLoading(false);
        }
    };

    const handleEditDepartment = async (oldName) => {
        const newName = prompt('Enter new department name:', oldName);
        if (!newName || newName.trim() === oldName) return;

        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            await axios.put(`${API}/employees/departments/${oldName}`, { newName: newName.trim() }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert('Department updated successfully!');
            fetchDepartments();
        } catch (error) {
            console.error('Error updating department:', error);
            alert(error.response?.data?.message || 'Error updating department');
        }
    };

    const handleDeleteDepartment = async (deptName) => {
        if (!confirm(`Are you sure you want to delete the ${deptName} department?`)) return;

        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            await axios.delete(`${API}/employees/departments/${deptName}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert('Department deleted successfully!');
            fetchDepartments();
        } catch (error) {
            console.error('Error deleting department:', error);
            alert(error.response?.data?.message || 'Error deleting department');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Departments Directory</h2>
                    <p className="text-xs text-slate-400 font-medium">Manage organizational structure</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={16} /> Add Department
                </button>
            </div>

            {fetching ? (
                <div className="flex justify-center items-center py-16">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    <p className="ml-4 text-slate-500 font-bold">Loading departments...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {departments.length === 0 ? (
                        <div className="col-span-full text-center py-16">
                            <Briefcase size={48} className="text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-bold">No departments found</p>
                            <p className="text-slate-400 text-sm mt-1">Add your first department to get started</p>
                        </div>
                    ) : (
                        departments.map((dept, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative">
                                <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                                    <button 
                                        onClick={() => handleEditDepartment(dept.name)}
                                        className="p-1.5 text-slate-400 hover:text-emerald-600 bg-emerald-50 rounded transition-colors" 
                                        title="Edit Department"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteDepartment(dept.name)}
                                        className="p-1.5 text-slate-400 hover:text-rose-600 bg-rose-50 rounded transition-colors" 
                                        title="Delete Department"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                                    <Briefcase size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">{dept.name}</h3>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-4">
                                    Department Unit
                                </p>

                                <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-4">
                                    <div className="flex items-center gap-2">
                                        <Users size={16} className="text-slate-400" />
                                        <span className="text-xs font-bold text-slate-600">{dept.employees} Staff</span>
                                    </div>
                                    <span className="text-xs font-bold text-emerald-600">Active</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Add Department Modal */}
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
                                <h3 className="text-2xl font-black text-slate-900">Add New Department</h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Department Name</label>
                                    <input
                                        type="text"
                                        value={newDepartmentName}
                                        onChange={(e) => setNewDepartmentName(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                                        placeholder="e.g., Engineering, Marketing, HR"
                                        autoFocus
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 px-4 py-3 border border-slate-300 rounded-lg font-bold hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddDepartment}
                                        disabled={loading}
                                        className="flex-1 btn-primary py-3 font-bold disabled:opacity-50"
                                    >
                                        {loading ? 'Adding...' : 'Add Department'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Departments;
