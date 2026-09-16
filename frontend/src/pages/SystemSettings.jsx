import React from 'react';
import { Settings, Bell, Shield, Database, Save } from 'lucide-react';

const SystemSettings = () => {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Configuration</h2>
                    <p className="text-xs text-slate-400 font-medium">Manage global portal settings and preferences</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Save size={16} /> Save Configurations
                </button>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
                            <Settings size={20} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-2">General Preferences</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Basic settings for the portal including timezones and localizations.</p>
                    </div>
                    <div className="md:w-2/3 space-y-4">
                        <div>
                            <label className="label-premium">Company Name</label>
                            <input type="text" defaultValue="PayRollHub Enterprise" className="input-field mt-1" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label-premium">Timezone</label>
                                <select className="input-field mt-1 bg-white">
                                    <option>Asia/Kolkata (IST)</option>
                                    <option>UTC (GMT+0)</option>
                                </select>
                            </div>
                            <div>
                                <label className="label-premium">Currency Format</label>
                                <select className="input-field mt-1 bg-white">
                                    <option>INR (₹)</option>
                                    <option>USD ($)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                        <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center mb-4">
                            <Bell size={20} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-2">Notifications</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Configure automated emails and system alerts.</p>
                    </div>
                    <div className="md:w-2/3 space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">Email Alerts</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Send summary emails directly to employees.</p>
                            </div>
                            <div className="w-10 h-5 bg-emerald-600 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 bottom-1 w-3 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">System Logs</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Record detailed API interactions for auditing.</p>
                            </div>
                            <div className="w-10 h-5 bg-emerald-600 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 bottom-1 w-3 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
