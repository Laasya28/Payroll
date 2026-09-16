const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

// Create default admin if not exists
const createDefaultAdmin = async () => {
    try {
        const User = require('./models/User');
        const Employee = require('./models/Employee');
        
        const existingAdmin = await User.findOne({ email: 'admin@company.com' });
        
        if (!existingAdmin) {
            // Create admin employee record
            const adminEmployee = await Employee.create({
                firstName: 'System',
                lastName: 'Administrator',
                email: 'admin@company.com',
                phone: '+919876543210',
                department: 'IT',
                designation: 'System Administrator',
                salaryStructure: {
                    baseSalary: 100000,
                    allowances: 20000,
                    deductions: 5000
                }
            });
            
            // Create admin user
            await User.create({
                email: 'admin@company.com',
                password: 'admin123',
                role: 'admin',
                phone: '+919876543210',
                position: 'System Administrator',
                employeeId: adminEmployee._id,
                isVerified: true
            });
            
            console.log('Default admin user created: admin@company.com / admin123');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
};

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('Payroll API is running...');
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/employees', require('./routes/employee.routes'));
app.use('/api/payroll', require('./routes/payroll.routes'));
app.use('/api/expenses', require('./routes/expense.routes'));
app.use('/api/leaves', require('./routes/leave.routes'));
app.use('/api/attendance', require('./routes/attendance.routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`MongoDB Connected: ${process.env.MONGO_URI || 'localhost'}`);
    
    // Create default admin user
    await createDefaultAdmin();
});
