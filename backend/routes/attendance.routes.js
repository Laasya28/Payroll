const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { protect } = require('../middleware/auth');

// @desc    Clock in
// @route   POST /api/attendance/clockin
router.post('/clockin', protect, async (req, res) => {
    try {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];

        const existing = await Attendance.findOne({
            employeeId: req.user.employeeId,
            dateString,
        });

        if (existing && existing.status === 'Active') {
            return res.status(400).json({ message: 'Already clocked in today' });
        }

        const record = await Attendance.create({
            employeeId: req.user.employeeId,
            date: today,
            dateString,
            clockIn: today,
            status: 'Active',
        });

        res.status(201).json(record);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Clock out
// @route   PUT /api/attendance/clockout
router.put('/clockout', protect, async (req, res) => {
    try {
        const dateString = new Date().toISOString().split('T')[0];
        const record = await Attendance.findOne({
            employeeId: req.user.employeeId,
            dateString,
            status: 'Active',
        });

        if (!record) {
            return res.status(404).json({ message: 'No active clock-in found for today' });
        }

        record.clockOut = new Date();
        record.status = 'Completed';
        await record.save();

        res.json(record);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Get attendance for the logged-in employee
// @route   GET /api/attendance/my
router.get('/my', protect, async (req, res) => {
    try {
        const records = await Attendance.find({ employeeId: req.user.employeeId }).sort({ date: -1 });
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Get all attendance records (admin)
// @route   GET /api/attendance
router.get('/', protect, async (req, res) => {
    try {
        const records = await Attendance.find({}).populate('employeeId', 'firstName lastName email').sort({ date: -1 });
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
