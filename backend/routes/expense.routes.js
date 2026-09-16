const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Expense = require('../models/Expense');
const { protect, admin } = require('../middleware/auth');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'receipts');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB max

// @desc    Submit an expense claim (with optional receipt upload)
// @route   POST /api/expenses
router.post('/', protect, upload.single('receipt'), async (req, res) => {
    try {
        const receiptUrl = req.file ? `/uploads/receipts/${req.file.filename}` : null;
        const expense = new Expense({
            ...req.body,
            employee: req.user.employeeId || req.body.employeeId,
            receiptUrl,
            dateOccurred: req.body.dateOccurred || new Date(),
        });
        const createdExpense = await expense.save();
        res.status(201).json(createdExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get logged-in employee's own expenses
// @route   GET /api/expenses/my
router.get('/my', protect, async (req, res) => {
    try {
        const expenses = await Expense.find({ employee: req.user.employeeId }).sort({ createdAt: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all expenses (Admin only)
// @route   GET /api/expenses
router.get('/', protect, admin, async (req, res) => {
    try {
        const expenses = await Expense.find({}).populate('employee', 'firstName lastName');
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Approve expense (Admin)
// @route   PUT /api/expenses/:id/approve
router.put('/:id/approve', protect, admin, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (expense) {
            expense.status = 'approved';
            expense.approvedAt = new Date();
            expense.approvedBy = req.user.id;
            const updatedExpense = await expense.save();
            res.json(updatedExpense);
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Reject expense (Admin)
// @route   PUT /api/expenses/:id/reject
router.put('/:id/reject', protect, admin, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (expense) {
            expense.status = 'rejected';
            expense.rejectedAt = new Date();
            expense.rejectedBy = req.user.id;
            const updatedExpense = await expense.save();
            res.json(updatedExpense);
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Approve/Reject expense (Admin)
// @route   PUT /api/expenses/:id/status
router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (expense) {
            expense.status = req.body.status;
            const updatedExpense = await expense.save();
            res.json(updatedExpense);
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Download expense receipt
// @route   GET /api/expenses/receipt/:id
router.get('/receipt/:id', protect, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense || !expense.receiptUrl) {
            return res.status(404).json({ message: 'Receipt not found' });
        }

        const filePath = path.join(__dirname, '..', expense.receiptUrl);
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).json({ message: 'Receipt file not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
