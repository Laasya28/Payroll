import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { User, Mail, Phone, Shield, Camera, Save, X, RefreshCw } from 'lucide-react';

const API = 'http://localhost:5000/api';

const Profile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        department: '',
        designation: '',
        bankDetails: {
            accountName: '',
            accountNumber: '',
            bankName: '',
            ifscCode: ''
        }
    });

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API}/employees/profile`);
            setProfileData(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.employeeId) {
            fetchProfile();
        }
    }, [user?.employeeId]);

    const handleSave = async () => {
        try {
            setLoading(true);
            await axios.put(`${API}/employees/profile`, profileData);
            setIsEditing(false);
            alert('Profile updated successfully!');
            fetchProfile();
        } catch (error) {
            alert(error.response?.data?.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        fetchProfile();
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20 pt-10">
            <header className="border-b-4 border-emerald-600 pb-6 mb-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Personnel Profile</h1>
                <p className="text-gray-400 font-bold mt-2 italic flex items-center gap-2 text-sm">
                    <Shield size={16} className="text-emerald-600" /> Official organizational identification card
                </p>
            </header>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-6">
                    <div className="card-classic p-8 text-center bg-white border-2 border-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="relative w-32 h-32 mx-auto mb-6">
                            <div className="w-full h-full bg-emerald-600 rounded-3xl flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-emerald-200">
                                {profileData.firstName?.[0] || 'U'}
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-3 bg-white border border-gray-100 rounded-2xl text-emerald-600 shadow-lg hover:scale-110 transition-transform">
                                <Camera size={18} />
                            </button>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                            {profileData.firstName} {profileData.lastName}
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 inline-block px-3 py-1 rounded-full mt-2 border border-emerald-100">
                            Access: {user?.role}
                        </p>
                        <div className="mt-4 space-y-2">
                            <p className="text-xs font-bold text-slate-600">{profileData.designation}</p>
                            <p className="text-xs font-bold text-slate-400">{profileData.department}</p>
                        </div>
                    </div>

                    <div className="card-classic p-6 bg-slate-50 border-2 border-slate-100">
                        <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-4">Organizational Metrics</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Employee ID</span>
                                <span className="text-sm font-black text-slate-900">EMP{user?.employeeId?.slice(-6) || '000001'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Employment Duration</span>
                                <span className="text-sm font-black text-slate-900">
                                    {profileData.joiningDate ? 
                                        Math.floor((new Date() - new Date(profileData.joiningDate)) / (365.25 * 24 * 60 * 60 * 1000)) + '.0 Years' 
                                        : '0.0 Years'
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6 text-left">
                    <div className="card-classic p-10 bg-white border-2 border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 -mr-16 -mt-16 rounded-full" />
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black underline decoration-emerald-500 decoration-4 underline-offset-8 uppercase tracking-widest">Corporate Dossier</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={fetchProfile}
                                    className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg transition-colors"
                                    title="Refresh"
                                >
                                    <RefreshCw size={16} />
                                </button>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleCancel}
                                            className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all"
                                        >
                                            <X size={14} className="inline mr-1" /> Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-700 transition-all disabled:opacity-60"
                                        >
                                            <Save size={14} className="inline mr-1" /> {loading ? 'Saving...' : 'Save'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">First Name</label>
                                    <input
                                        type="text" 
                                        disabled={!isEditing} 
                                        value={profileData.firstName || ''}
                                        onChange={e => setProfileData({ ...profileData, firstName: e.target.value })}
                                        className={`input-field ${!isEditing && 'bg-slate-50 border-transparent cursor-not-allowed'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Last Name</label>
                                    <input
                                        type="text" 
                                        disabled={!isEditing} 
                                        value={profileData.lastName || ''}
                                        onChange={e => setProfileData({ ...profileData, lastName: e.target.value })}
                                        className={`input-field ${!isEditing && 'bg-slate-50 border-transparent cursor-not-allowed'}`}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Corporate Email</label>
                                    <input 
                                        type="text" 
                                        disabled 
                                        value={user?.email || ''} 
                                        className="input-field bg-slate-50 border-transparent cursor-not-allowed" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Verified Contact</label>
                                    <input
                                        type="text" 
                                        disabled={!isEditing} 
                                        value={profileData.phone || ''}
                                        onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                                        className={`input-field ${!isEditing && 'bg-slate-50 border-transparent cursor-not-allowed'}`}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Department</label>
                                    <input
                                        type="text" 
                                        disabled={!isEditing} 
                                        value={profileData.department || ''}
                                        onChange={e => setProfileData({ ...profileData, department: e.target.value })}
                                        className={`input-field ${!isEditing && 'bg-slate-50 border-transparent cursor-not-allowed'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Designation</label>
                                    <input
                                        type="text" 
                                        disabled={!isEditing} 
                                        value={profileData.designation || ''}
                                        onChange={e => setProfileData({ ...profileData, designation: e.target.value })}
                                        className={`input-field ${!isEditing && 'bg-slate-50 border-transparent cursor-not-allowed'}`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Bank Disbursement Details</h4>
                                    <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter bg-green-50 text-green-600 border border-green-100">
                                        Verified
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Account Name</label>
                                        <input
                                            type="text" 
                                            disabled={!isEditing} 
                                            value={profileData.bankDetails?.accountName || ''}
                                            onChange={e => setProfileData({ 
                                                ...profileData, 
                                                bankDetails: { ...profileData.bankDetails, accountName: e.target.value }
                                            })}
                                            className={`input-field ${!isEditing && 'bg-slate-50 border-transparent cursor-not-allowed'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Bank Name</label>
                                        <input
                                            type="text" 
                                            disabled={!isEditing} 
                                            value={profileData.bankDetails?.bankName || ''}
                                            onChange={e => setProfileData({ 
                                                ...profileData, 
                                                bankDetails: { ...profileData.bankDetails, bankName: e.target.value }
                                            })}
                                            className={`input-field ${!isEditing && 'bg-slate-50 border-transparent cursor-not-allowed'}`}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Account Number</label>
                                        <input
                                            type="text" 
                                            disabled={!isEditing} 
                                            value={profileData.bankDetails?.accountNumber || ''}
                                            onChange={e => setProfileData({ 
                                                ...profileData, 
                                                bankDetails: { ...profileData.bankDetails, accountNumber: e.target.value }
                                            })}
                                            className={`input-field ${!isEditing && 'bg-slate-50 border-transparent cursor-not-allowed'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">IFSC Code</label>
                                        <input
                                            type="text" 
                                            disabled={!isEditing} 
                                            value={profileData.bankDetails?.ifscCode || ''}
                                            onChange={e => setProfileData({ 
                                                ...profileData, 
                                                bankDetails: { ...profileData.bankDetails, ifscCode: e.target.value }
                                            })}
                                            className={`input-field ${!isEditing && 'bg-slate-50 border-transparent cursor-not-allowed'}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t-2 border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 text-green-500 rounded-lg border border-green-100"><Shield size={20} /></div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-tight">Encrypted Secure Profile<br />Multi-Factor Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Profile;
