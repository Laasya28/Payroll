const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: Date, required: true },
    dateString: { type: String, required: true }, // For easier querying (e.g. YYYY-MM-DD)
    clockIn: { type: Date },
    clockOut: { type: Date },
    status: { type: String, enum: ['Active', 'Completed'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
