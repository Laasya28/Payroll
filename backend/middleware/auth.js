const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = await User.findById(decoded.id).select('-password').populate('employeeId');
            
            // If no employeeId, try to find by email
            if (!req.user.employeeId && req.user.email) {
                const Employee = require('../models/Employee');
                const employee = await Employee.findOne({ email: req.user.email });
                if (employee) {
                    req.user.employeeId = employee._id;
                    // Update user with employeeId
                    await User.findByIdAndUpdate(req.user._id, { employeeId: employee._id });
                }
            }
            
            next();
        } catch (error) {
            console.error('Auth error:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
