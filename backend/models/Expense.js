const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, enum: ['Travel', 'Food', 'Equipment', 'Other'], default: 'Other' },
    description: { type: String },
    receiptUrl: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    dateOccurred: { type: Date, required: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
