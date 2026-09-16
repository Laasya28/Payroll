const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const { protect, admin } = require('../middleware/auth');

// @desc    Get logged-in employee's own profile record
// @route   GET /api/employees/profile
router.get('/profile', protect, async (req, res) => {
    try {
        const employee = await Employee.findById(req.user.employeeId);
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ message: 'Employee profile not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update logged-in employee's own profile (name, phone, bank)
// @route   PUT /api/employees/profile
router.put('/profile', protect, async (req, res) => {
    try {
        const employee = await Employee.findById(req.user.employeeId);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        const { firstName, lastName, phone, department, designation, bankDetails } = req.body;
        if (firstName) employee.firstName = firstName;
        if (lastName) employee.lastName = lastName;
        if (phone) employee.phone = phone;
        if (department) employee.department = department;
        if (designation) employee.designation = designation;
        if (bankDetails) employee.bankDetails = { ...employee.bankDetails, ...bankDetails };

        const updated = await employee.save();
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get all employees
// @route   GET /api/employees
router.get('/', protect, admin, async (req, res) => {
    try {
        const employees = await Employee.find({});
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Register a new employee (Admin)
// @route   POST /api/employees
router.post('/', protect, admin, async (req, res) => {
    try {
        const employee = new Employee(req.body);
        const createdEmployee = await employee.save();
        res.status(201).json(createdEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get employee by ID
// @route   GET /api/employees/:id
router.get('/:id', protect, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update employee (Admin)
// @route   PUT /api/employees/:id
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (employee) {
            Object.assign(employee, req.body);
            const updatedEmployee = await employee.save();
            res.json(updatedEmployee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete employee (Admin)
// @route   DELETE /api/employees/:id
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (employee) {
            await employee.deleteOne();
            res.json({ message: 'Employee deleted successfully' });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update department name for all employees in a department
// @route   PUT /api/employees/department
router.put('/department', protect, admin, async (req, res) => {
    try {
        const { oldDepartment, newDepartment } = req.body;
        await Employee.updateMany(
            { department: oldDepartment },
            { department: newDepartment }
        );
        res.json({ message: 'Department updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete department (remove department from all employees)
// @route   DELETE /api/employees/department/:department
router.delete('/department/:department', protect, admin, async (req, res) => {
    try {
        await Employee.updateMany(
            { department: req.params.department },
            { $unset: { department: "" } }
        );
        res.json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add new department
// @route   POST /api/employees/departments
router.post('/departments', protect, admin, async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({ message: 'Department name is required' });
        }
        
        // Check if department already exists
        const Employee = require('../models/Employee');
        const existingDept = await Employee.distinct('department');
        if (existingDept.includes(name)) {
            return res.status(400).json({ message: 'Department already exists' });
        }
        
        // For now, just return success - departments are created when employees are added
        // The frontend will track departments from existing employees
        res.status(201).json({ message: 'Department added successfully', department: name });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete department
// @route   DELETE /api/employees/departments/:department
router.delete('/departments/:department', protect, admin, async (req, res) => {
    try {
        const { department } = req.params;
        
        // Check if department has employees
        const Employee = require('../models/Employee');
        const employeesInDept = await Employee.countDocuments({ department });
        if (employeesInDept > 0) {
            return res.status(400).json({ 
                message: 'Cannot delete department with employees. Please reassign or remove employees first.' 
            });
        }
        
        res.status(200).json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
