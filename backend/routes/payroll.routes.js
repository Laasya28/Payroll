const express = require('express');
const router = express.Router();
const Salary = require('../models/Salary');
const { protect, admin } = require('../middleware/auth');

// @desc    Get logged-in employee's own payslips
// @route   GET /api/payroll/my
router.get('/my', protect, async (req, res) => {
    try {
        const history = await Salary.find({ employee: req.user.employeeId }).sort({ year: -1, month: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Generate payroll for an employee
// @route   POST /api/payroll/generate
router.post('/generate', protect, admin, async (req, res) => {
    try {
        const { 
            employeeId, 
            month, 
            year, 
            bonus, 
            basicSalary,
            hra,
            specialAllowance,
            overtimePay,
            totalEarnings,
            deductions,
            professionalTax,
            totalDeductions,
            netSalary,
            status
        } = req.body;
        
        if (employeeId) {
            // Generate for specific employee
            const Employee = require('../models/Employee');
            const employee = await Employee.findById(employeeId);

            if (!employee) return res.status(404).json({ message: 'Employee not found' });

            const salary = await Salary.create({
                employee: employeeId,
                month,
                year,
                basicSalary: basicSalary || employee.salaryStructure?.baseSalary || 0,
                hra: hra || 0,
                specialAllowance: specialAllowance || 0,
                bonus: bonus || 0,
                overtimePay: overtimePay || 0,
                totalEarnings: totalEarnings || 0,
                deductions: deductions || 0,
                professionalTax: professionalTax || 0,
                totalDeductions: totalDeductions || 0,
                netSalary: netSalary || 0,
                status: status || 'pending'
            });

            res.status(201).json(salary);
        } else {
            // Generate for all employees
            const Employee = require('../models/Employee');
            const employees = await Employee.find({});
            
            const salaries = [];
            for (const employee of employees) {
                const basePaid = employee.salaryStructure?.baseSalary || 0;
                const allowancesPaid = employee.salaryStructure?.allowances || 0;
                const deductionsTotal = employee.salaryStructure?.deductions || 0;
                const netSalary = (basePaid + allowancesPaid + (bonus || 0)) - deductionsTotal;

                const salary = await Salary.create({
                    employee: employee._id,
                    month,
                    year,
                    basicSalary: basePaid,
                    hra: allowancesPaid * 0.4,
                    specialAllowance: allowancesPaid * 0.6,
                    bonus: bonus || 0,
                    overtimePay: 0,
                    totalEarnings: basePaid + allowancesPaid + (bonus || 0),
                    deductions: deductionsTotal,
                    professionalTax: 200,
                    totalDeductions: deductionsTotal + 200,
                    netSalary,
                    status: 'pending'
                });
                
                salaries.push(salary);
            }

            res.status(201).json(salaries);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Approve/Pay a salary record
// @route   PUT /api/payroll/:id/approve
router.put('/:id/approve', protect, admin, async (req, res) => {
    try {
        const salary = await Salary.findById(req.params.id);
        if (!salary) return res.status(404).json({ message: 'Payroll record not found' });
        salary.status = 'paid';
        salary.paidAt = new Date();
        await salary.save();
        res.json(salary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get payroll history for a specific employee (Admin)
// @route   GET /api/payroll/:employeeId
router.get('/:employeeId', protect, async (req, res) => {
    try {
        const history = await Salary.find({ employee: req.params.employeeId }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all payroll records (Admin)
// @route   GET /api/payroll
router.get('/', protect, admin, async (req, res) => {
    try {
        const payroll = await Salary.find({}).populate('employee', 'firstName lastName').sort({ createdAt: -1 });
        res.json(payroll);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Preview payslip
// @route   GET /api/payroll/payslip/:id
router.get('/payslip/:id', protect, async (req, res) => {
    try {
        const salary = await Salary.findById(req.params.id).populate('employee', 'firstName lastName email department designation employeeId');
        if (!salary) return res.status(404).json({ message: 'Payslip not found' });
        
        // Generate HTML preview
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Payslip - ${salary.employee.firstName} ${salary.employee.lastName}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; background: white; }
                .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
                .company-info { text-align: center; margin-bottom: 30px; }
                .details { margin: 20px 0; }
                .row { display: flex; justify-content: space-between; margin: 10px 0; padding: 5px 0; }
                .section-title { font-weight: bold; font-size: 16px; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
                .total { border-top: 2px solid #333; padding-top: 10px; font-weight: bold; font-size: 16px; }
                .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; }
                @media print { body { margin: 10px; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>PAYROLL MANAGEMENT SYSTEM</h1>
                <h2>PAYSLIP</h2>
                <p>For the month of ${salary.month}/${salary.year}</p>
            </div>
            
            <div class="company-info">
                <h3>Employee Details</h3>
                <div class="row">
                    <span>Employee ID:</span>
                    <span>${salary.employee.employeeId || 'EMP' + salary.employee._id.slice(-6)}</span>
                </div>
                <div class="row">
                    <span>Employee Name:</span>
                    <span>${salary.employee.firstName} ${salary.employee.lastName}</span>
                </div>
                <div class="row">
                    <span>Department:</span>
                    <span>${salary.employee.department || 'N/A'}</span>
                </div>
                <div class="row">
                    <span>Designation:</span>
                    <span>${salary.employee.designation || 'N/A'}</span>
                </div>
            </div>
            
            <div class="details">
                <div class="section-title">EARNINGS</div>
                <div class="row">
                    <span>Basic Salary:</span>
                    <span>₹${salary.basicSalary?.toLocaleString('en-IN') || 0}</span>
                </div>
                <div class="row">
                    <span>HRA (House Rent Allowance):</span>
                    <span>₹${salary.hra?.toLocaleString('en-IN') || 0}</span>
                </div>
                <div class="row">
                    <span>Special Allowance:</span>
                    <span>₹${salary.specialAllowance?.toLocaleString('en-IN') || 0}</span>
                </div>
                <div class="row">
                    <span>Bonus:</span>
                    <span>₹${salary.bonus?.toLocaleString('en-IN') || 0}</span>
                </div>
                <div class="row">
                    <span>Overtime Pay:</span>
                    <span>₹${salary.overtimePay?.toLocaleString('en-IN') || 0}</span>
                </div>
                <div class="row total">
                    <span>Total Earnings:</span>
                    <span>₹${salary.totalEarnings?.toLocaleString('en-IN') || 0}</span>
                </div>
                
                <div class="section-title">DEDUCTIONS</div>
                <div class="row">
                    <span>Other Deductions:</span>
                    <span>₹${salary.deductions?.toLocaleString('en-IN') || 0}</span>
                </div>
                <div class="row">
                    <span>Professional Tax:</span>
                    <span>₹${salary.professionalTax?.toLocaleString('en-IN') || 0}</span>
                </div>
                <div class="row total">
                    <span>Total Deductions:</span>
                    <span>₹${salary.totalDeductions?.toLocaleString('en-IN') || 0}</span>
                </div>
                
                <div class="row total" style="font-size: 18px; border-top: 3px solid #333; margin-top: 20px;">
                    <span>NET SALARY:</span>
                    <span>₹${salary.netSalary?.toLocaleString('en-IN') || 0}</span>
                </div>
            </div>
            
            <div class="footer">
                <p>This is a computer-generated payslip and does not require signature.</p>
                <p>Generated on: ${new Date().toLocaleDateString('en-IN')}</p>
            </div>
        </body>
        </html>
        `;
        
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Download payslip as PDF
// @route   GET /api/payroll/download/:id
router.get('/download/:id', protect, async (req, res) => {
    try {
        const salary = await Salary.findById(req.params.id).populate('employee', 'firstName lastName email department designation');
        if (!salary) return res.status(404).json({ message: 'Payslip not found' });
        
        // For now, return the same HTML as preview
        // In a real application, you would generate a PDF here
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Payslip - ${salary.employee.firstName} ${salary.employee.lastName}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
                .details { margin: 20px 0; }
                .row { display: flex; justify-content: space-between; margin: 10px 0; }
                .total { border-top: 2px solid #333; padding-top: 10px; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Payroll Management System</h1>
                <h2>Payslip</h2>
            </div>
            <div class="details">
                <div class="row">
                    <span>Employee Name:</span>
                    <span>${salary.employee.firstName} ${salary.employee.lastName}</span>
                </div>
                <div class="row">
                    <span>Department:</span>
                    <span>${salary.employee.department || 'N/A'}</span>
                </div>
                <div class="row">
                    <span>Designation:</span>
                    <span>${salary.employee.designation || 'N/A'}</span>
                </div>
                <div class="row">
                    <span>Month:</span>
                    <span>${salary.month}/${salary.year}</span>
                </div>
                <hr>
                <h3>Earnings</h3>
                <div class="row">
                    <span>Basic Salary:</span>
                    <span>₹${salary.basePaid || 0}</span>
                </div>
                <div class="row">
                    <span>Allowances:</span>
                    <span>₹${salary.allowancesPaid || 0}</span>
                </div>
                <div class="row">
                    <span>Bonus:</span>
                    <span>₹${salary.bonus || 0}</span>
                </div>
                <hr>
                <h3>Deductions</h3>
                <div class="row">
                    <span>Total Deductions:</span>
                    <span>₹${salary.deductionsTotal || 0}</span>
                </div>
                <div class="row total">
                    <span>Net Salary:</span>
                    <span>₹${salary.netSalary || 0}</span>
                </div>
            </div>
        </body>
        </html>
        `;
        
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Disposition', `attachment; filename="payslip_${salary.employee.firstName}_${salary.month}_${salary.year}.html"`);
        res.send(html);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Download employee statement
// @route   GET /api/payroll/statement/:employeeId/:month/:year
router.get('/statement/:employeeId/:month/:year', protect, admin, async (req, res) => {
    try {
        const { employeeId, month, year } = req.params;
        const Employee = require('../models/Employee');
        const employee = await Employee.findById(employeeId);
        
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        
        const salary = await Salary.findOne({ employee: employeeId, month: parseInt(month), year: parseInt(year) });
        
        // Generate statement HTML
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Employee Statement - ${employee.firstName} ${employee.lastName}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
                .details { margin: 20px 0; }
                .row { display: flex; justify-content: space-between; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Payroll Management System</h1>
                <h2>Employee Statement</h2>
            </div>
            <div class="details">
                <div class="row">
                    <span>Employee Name:</span>
                    <span>${employee.firstName} ${employee.lastName}</span>
                </div>
                <div class="row">
                    <span>Email:</span>
                    <span>${employee.email}</span>
                </div>
                <div class="row">
                    <span>Department:</span>
                    <span>${employee.department || 'N/A'}</span>
                </div>
                <div class="row">
                    <span>Designation:</span>
                    <span>${employee.designation || 'N/A'}</span>
                </div>
                <div class="row">
                    <span>Period:</span>
                    <span>${month}/${year}</span>
                </div>
                ${salary ? `
                <hr>
                <h3>Salary Details</h3>
                <div class="row">
                    <span>Basic Salary:</span>
                    <span>₹${salary.basePaid || 0}</span>
                </div>
                <div class="row">
                    <span>Net Salary:</span>
                    <span>₹${salary.netSalary || 0}</span>
                </div>
                <div class="row">
                    <span>Status:</span>
                    <span>${salary.status}</span>
                </div>
                ` : '<p>No salary record found for this period</p>'}
            </div>
        </body>
        </html>
        `;
        
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Disposition', `attachment; filename="statement_${employee.firstName}_${month}_${year}.html"`);
        res.send(html);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
