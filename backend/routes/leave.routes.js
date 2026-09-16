const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
const { protect, admin } = require('../middleware/auth');

// @desc    Apply for leave (employee)
// @route   POST /api/leaves
router.post('/', protect, async (req, res) => {
    try {
        const leave = new Leave({
            ...req.body,
            employee: req.user.employeeId || req.body.employeeId
        });
        const createdLeave = await leave.save();
        res.status(201).json(createdLeave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get logged-in employee's own leave requests
// @route   GET /api/leaves/my
router.get('/my', protect, async (req, res) => {
    try {
        const leaves = await Leave.find({ employee: req.user.employeeId }).sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all leave requests (Admin only)
// @route   GET /api/leaves
router.get('/', protect, admin, async (req, res) => {
    try {
        const leaves = await Leave.find({}).populate('employee', 'firstName lastName').sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update leave status (Admin)
// @route   PUT /api/leaves/:id
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (leave) {
            leave.status = req.body.status || leave.status;
            const updatedLeave = await leave.save();
            res.json(updatedLeave);
        } else {
            res.status(404).json({ message: 'Leave not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
