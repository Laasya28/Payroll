import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, trendValue }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="glass-card p-6 flex flex-col gap-6"
        >
            <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 border border-gray-100">
                    {icon}
                </div>
                {/* Mini Sparkline SVG */}
                <div className="w-24 h-10">
                    <svg viewBox="0 0 100 40" className="w-full h-full">
                        <path
                            d="M0 35 Q 20 10, 40 30 T 80 15 T 100 25"
                            fill="none"
                            stroke="#E2E8F0"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
            </div>

            <div>
                <h3 className="text-4xl font-black text-text tracking-tighter mb-1">{value} <span className="text-sm font-bold text-gray-400 ml-1">{title}</span></h3>
                <p className="text-[10px] font-black text-text uppercase tracking-widest">
                    <span className={trendValue.startsWith('+') ? 'text-green-500' : 'text-red-500'}>{trendValue}</span>
                    <span className="text-gray-400 ml-2">from last week</span>
                </p>
            </div>
        </motion.div>
    );
};

export default StatCard;
