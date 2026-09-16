import React from 'react';
import { Calculator, Save } from 'lucide-react';

const TaxSettings = () => {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Tax Configurations</h2>
                    <p className="text-xs text-slate-400 font-medium">Manage corporate tax slabs and deductions</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Save size={16} /> Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                            <Calculator size={20} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Global Deductions</h3>
                    </div>

                    <div>
                        <label className="label-premium">Standard Provident Fund (%)</label>
                        <input type="number" defaultValue="12" className="input-field mt-2" />
                    </div>
                    <div>
                        <label className="label-premium">Professional Tax (₹)</label>
                        <input type="number" defaultValue="200" className="input-field mt-2" />
                    </div>
                    <div>
                        <label className="label-premium">Health Insurance Base (₹)</label>
                        <input type="number" defaultValue="1500" className="input-field mt-2" />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Income Tax Slabs (Old Regime)</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-xs font-bold text-slate-600">Up to ₹2.5 Lakhs</span>
                            <span className="text-xs font-bold text-emerald-600">NIL (0%)</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-xs font-bold text-slate-600">₹2.5L - ₹5L</span>
                            <span className="text-xs font-bold text-slate-900">5%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-xs font-bold text-slate-600">₹5L - ₹10L</span>
                            <span className="text-xs font-bold text-slate-900">20%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-xs font-bold text-slate-600">Above ₹10L</span>
                            <span className="text-xs font-bold text-slate-900">30%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaxSettings;
