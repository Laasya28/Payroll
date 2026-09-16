const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    month: { type: Number, required: true }, // 1-12
    year: { type: Number, required: true },
    
    // Earnings
    basicSalary: { type: Number, required: true },
    hra: { type: Number, default: 0 },
    specialAllowance: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    overtimePay: { type: Number, default: 0 },
    totalEarnings: { type: Number, required: true },
    
    // Deductions
    deductions: { type: Number, default: 0 },
    professionalTax: { type: Number, default: 0 },
    totalDeductions: { type: Number, default: 0 },
    
    // Net
    netSalary: { type: Number, required: true },
    
    // Status
    status: { type: String, enum: ['pending', 'issued', 'paid'], default: 'pending' },
    paymentDate: { type: Date },
    
    // Legacy fields for backward compatibility
    basePaid: { type: Number }, // Will be mapped to basicSalary
    allowancesPaid: { type: Number }, // Will be mapped to hra + specialAllowance
    deductionsTotal: { type: Number }, // Will be mapped to totalDeductions
}, { timestamps: true });

module.exports = mongoose.model('Salary', salarySchema);
