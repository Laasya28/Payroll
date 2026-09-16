const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const userData = {
                _id: user._id,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
                message: 'Login successful'
            };
            
            res.json(userData);
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// @desc    Register a new user (Step 1 & 2)
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { email, password, role, phone, firstName, lastName, position } = req.body;
        
        // Validate required fields
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create Employee record first
        const Employee = require('../models/Employee');
        const employee = await Employee.create({
            firstName,
            lastName,
            email,
            phone: phone || '',
            department: 'General',
            designation: position || 'Employee',
            salaryStructure: { 
                baseSalary: 30000,
                allowances: 10000,
                deductions: 2000
            }
        });

        const normalizedPhone = phone && phone.length === 10 ? `+91${phone}` : phone || '';

        const user = await User.create({
            email,
            password,
            role: role || 'employee',
            phone: normalizedPhone,
            position,
            employeeId: employee._id,
            isVerified: true
        });

        if (user) {
            const userData = {
                _id: user._id,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
                employeeId: employee._id,
                firstName: employee.firstName,
                lastName: employee.lastName,
                message: 'Registration successful'
            };
            
            res.status(201).json(userData);
        } else {
            res.status(400).json({ message: 'Failed to create user account' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// @desc    Verify OTP (Step 3)
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (user && user.otp === otp) {
        if (user) {
            user.isVerified = true;
            await user.save();
            res.json({
                _id: user._id,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } else {
        res.status(400).json({ message: 'Invalid OTP' });
    }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
router.get('/profile', protect, async (req, res) => {
    const user = await User.findById(req.user._id).populate('employeeId');
    if (user) {
        res.json({
            _id: user._id,
            email: user.email,
            role: user.role,
            employeeId: user.employeeId?._id,
            firstName: user.employeeId?.firstName,
            lastName: user.employeeId?.lastName,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

module.exports = router;
