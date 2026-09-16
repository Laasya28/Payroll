import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Employees from './pages/Employees';
import Payroll from './pages/Payroll';
import Expenses from './pages/Expenses';
import Leaves from './pages/Leaves';
import Profile from './pages/Profile';

import Departments from './pages/Departments';
import AdminAttendance from './pages/AdminAttendance';
import TaxSettings from './pages/TaxSettings';
import SystemSettings from './pages/SystemSettings';
import MyPayslips from './pages/MyPayslips';
import MyAttendance from './pages/MyAttendance';
import MyExpenses from './pages/MyExpenses';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-72 flex flex-col">
        <Navbar />
        <main className="flex-1 p-8 pt-6 mx-auto w-full max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
};

const DashboardSwitch = () => {
  const { user } = useAuth();
  return user.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />

          {/* Main Dashboard */}
          <Route path="/dashboard" element={<PrivateRoute><Layout><DashboardSwitch /></Layout></PrivateRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<PrivateRoute><Layout><AdminDashboard /></Layout></PrivateRoute>} />
          <Route path="/employees" element={<PrivateRoute><Layout><Employees /></Layout></PrivateRoute>} />
          <Route path="/departments" element={<PrivateRoute><Layout><Departments /></Layout></PrivateRoute>} />
          <Route path="/attendance" element={<PrivateRoute><Layout><AdminAttendance /></Layout></PrivateRoute>} />
          <Route path="/payroll" element={<PrivateRoute><Layout><Payroll /></Layout></PrivateRoute>} />
          <Route path="/expenses" element={<PrivateRoute><Layout><Expenses /></Layout></PrivateRoute>} />
          <Route path="/tax" element={<PrivateRoute><Layout><TaxSettings /></Layout></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Layout><SystemSettings /></Layout></PrivateRoute>} />

          {/* Employee Routes */}
          <Route path="/employee" element={<PrivateRoute><Layout><EmployeeDashboard /></Layout></PrivateRoute>} />
          <Route path="/my-payslips" element={<PrivateRoute><Layout><MyPayslips /></Layout></PrivateRoute>} />
          <Route path="/my-attendance" element={<PrivateRoute><Layout><MyAttendance /></Layout></PrivateRoute>} />
          <Route path="/leaves" element={<PrivateRoute><Layout><Leaves /></Layout></PrivateRoute>} />
          <Route path="/my-expenses" element={<PrivateRoute><Layout><MyExpenses /></Layout></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />

          <Route path="/home" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
