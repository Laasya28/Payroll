import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    Calendar,
    CircleDollarSign,
    FileDown,
    CheckCircle2,
    ShieldCheck,
    Clock,
    FolderOpen
} from 'lucide-react';

const Home = () => {
    const aboutRef = useRef(null);
    const featuresRef = useRef(null);

    const scrollToSection = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white font-sans text-emerald-900 selection:bg-emerald-600 selection:text-white">
            {/* Header / Nav */}
            <header className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-emerald-50">
                <nav className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">P</div>
                            <span className="text-xl font-bold text-emerald-900 tracking-tight">PayRollHub</span>
                        </Link>
                        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-emerald-700">
                            <button onClick={() => scrollToSection(aboutRef)} className="hover:text-emerald-900 transition-colors">About System</button>
                            <button onClick={() => scrollToSection(featuresRef)} className="hover:text-emerald-900 transition-colors">Key Features</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-bold text-emerald-700 hover:text-emerald-900 px-4">Employee Login</Link>
                        <Link to="/admin-login" className="text-sm font-bold text-emerald-700 hover:text-emerald-900 px-4">Admin Login</Link>
                        <Link to="/register" className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm active:scale-95">Get Started</Link>
                    </div>
                </nav>
            </header>

            {/* 1 Hero Section with Banner */}
            <section className="relative pt-24 pb-20 md:pt-36 md:pb-32 bg-emerald-50/50 overflow-hidden">
                {/* Background Banner Image */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/90 to-emerald-100/80">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&h=600&fit=crop')] bg-cover bg-center opacity-10"></div>
                </div>
                
                <div className="relative max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <h1 className="text-5xl md:text-6xl font-bold text-emerald-950 leading-[1.2] mb-6">
                                Simplify Payroll Management <br />
                                <span className="text-emerald-600">with Accuracy and Ease</span>
                            </h1>
                            <p className="text-lg md:text-xl text-emerald-800/80 font-medium leading-relaxed mb-10">
                                A smart and secure system to manage employee salaries, attendance, and payslips in one place.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4 lg:justify-start justify-center">
                                <Link to="/login" className="w-full sm:w-auto bg-emerald-600 text-white px-10 py-4 rounded-xl text-base font-bold shadow-md hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                                    Employee Login
                                </Link>
                                <Link to="/admin-login" className="w-full sm:w-auto border-2 border-emerald-600 text-emerald-700 px-10 py-4 rounded-xl text-base font-bold hover:bg-emerald-50 transition-all text-center">
                                    Admin Login
                                </Link>
                                <Link to="/register" className="w-full sm:w-auto bg-emerald-600 text-white px-10 py-4 rounded-xl text-base font-bold hover:bg-emerald-700 transition-all text-center">
                                    Register
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop" 
                                    alt="Payroll Management System"
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent"></div>
                            </div>
                            {/* Floating Cards */}
                            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-emerald-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <Users size={16} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-emerald-900">500+</p>
                                        <p className="text-xs text-emerald-600">Employees</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-emerald-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <CircleDollarSign size={16} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-emerald-900">100%</p>
                                        <p className="text-xs text-emerald-600">Accuracy</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2 About the System with Banner */}
            <section ref={aboutRef} className="py-24 bg-white border-b border-emerald-50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="relative rounded-2xl overflow-hidden shadow-xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop" 
                                    alt="HR Management System"
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-emerald-900/20"></div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <h3 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-6">About Our Payroll System</h3>
                            <p className="text-lg text-emerald-800/80 font-medium leading-relaxed mb-6">
                                Our Payroll Management System helps organizations automate salary processing, manage employee records, track attendance, and generate payslips efficiently. It reduces manual errors and saves valuable time for HR and administration teams.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 size={20} className="text-emerald-600" />
                                    </div>
                                    <p className="text-emerald-800 font-medium">Automated salary calculations with 100% accuracy</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <ShieldCheck size={20} className="text-emerald-600" />
                                    </div>
                                    <p className="text-emerald-800 font-medium">Secure data handling and privacy protection</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Clock size={20} className="text-emerald-600" />
                                    </div>
                                    <p className="text-emerald-800 font-medium">Time-saving automation for HR teams</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3 Key Features Section with Banner */}
            <section ref={featuresRef} className="py-24 bg-emerald-50/30">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16 space-y-2">
                        <h3 className="text-3xl md:text-4xl font-bold text-emerald-950">Key Features</h3>
                        <p className="text-lg text-emerald-800/80 font-medium">Comprehensive tools to manage your payroll efficiently</p>
                    </div>
                    
                    {/* Feature Banner */}
                    <div className="mb-16 relative rounded-2xl overflow-hidden shadow-xl">
                        <img 
                            src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=300&fit=crop" 
                            alt="Payroll Features Dashboard"
                            className="w-full h-auto object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-emerald-600/60 flex items-center justify-center">
                            <div className="text-center text-white">
                                <h4 className="text-3xl font-bold mb-4">All-in-One Payroll Solution</h4>
                                <p className="text-lg font-medium max-w-2xl">From employee management to payslip generation - everything you need in one platform</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: 'Employee Management', desc: 'Manage employee details including department, designation, and salary information.', icon: <Users size={24} /> },
                            { title: 'Attendance Tracking', desc: 'Track daily attendance and calculate salary based on working days.', icon: <Calendar size={24} /> },
                            { title: 'Salary Calculation', desc: 'Automatically calculate gross salary, deductions, and net pay accurately.', icon: <CircleDollarSign size={24} /> },
                            { title: 'Payslip Generation', desc: 'Generate and download monthly payslips with detailed salary breakdown.', icon: <FileDown size={24} /> }
                        ].map((item, i) => (
                            <div key={i} className="p-8 bg-white rounded-2xl border border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all">
                                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                                    {item.icon}
                                </div>
                                <h4 className="text-xl font-bold text-emerald-900 mb-3">{item.title}</h4>
                                <p className="text-emerald-700/80 text-base leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4 How It Works with Banner */}
            <section className="py-24 bg-white border-y border-emerald-50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-4">How It Works</h3>
                        <p className="text-lg text-emerald-800/80 font-medium">Simple 3-step process to manage your payroll</p>
                    </div>
                    
                    {/* Process Banner */}
                    <div className="mb-16 relative rounded-2xl overflow-hidden shadow-xl">
                        <img 
                            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=250&fit=crop" 
                            alt="Payroll Process Workflow"
                            className="w-full h-auto object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/70 to-transparent flex items-end justify-center">
                            <div className="text-center text-white pb-8">
                                <h4 className="text-2xl font-bold mb-2">Streamlined Workflow</h4>
                                <p className="text-base font-medium">From setup to payroll generation in minutes</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-8 relative text-center">
                            {/* Connecting Line */}
                            <div className="hidden md:block absolute top-[2.5rem] left-[15%] right-[15%] h-0.5 bg-emerald-100 -z-10"></div>

                            {[
                                { step: '1', title: 'Add Employee Details', desc: 'Enter employee information and salary structure' },
                                { step: '2', title: 'Track Attendance', desc: 'Monitor daily attendance and working hours' },
                                { step: '3', title: 'Generate Salary & Payslip', desc: 'Process payroll and generate payslips automatically' }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className="w-20 h-20 bg-emerald-600 text-white rounded-full flex items-center justify-center text-3xl font-black shadow-lg mb-6 border-4 border-white">
                                        {item.step}
                                    </div>
                                    <h4 className="text-xl font-bold text-emerald-900 mb-3">{item.title}</h4>
                                    <p className="text-emerald-700/80 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 5 Why Choose Our System with Banner */}
            <section className="py-24 bg-emerald-900 text-white relative overflow-hidden">
                {/* Background Banner */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=600&fit=crop')] bg-cover bg-center opacity-10"></div>
                
                <div className="relative max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">Why Choose Our System</h3>
                        <p className="text-lg text-emerald-100/80 font-medium max-w-2xl mx-auto">Experience the benefits of modern payroll management</p>
                    </div>
                    
                    {/* Stats Banner */}
                    <div className="grid md:grid-cols-4 gap-6 mb-16">
                        {[
                            { number: '500+', label: 'Companies Trust Us' },
                            { number: '50K+', label: 'Employees Managed' },
                            { number: '99.9%', label: 'Uptime' },
                            { number: '24/7', label: 'Support' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-emerald-800/30 backdrop-blur-sm border border-emerald-700 rounded-xl p-6 text-center">
                                <div className="text-3xl font-bold text-emerald-100 mb-2">{stat.number}</div>
                                <div className="text-sm text-emerald-200/80">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-6">
                        {[
                            { title: 'Easy to Use', icon: <CheckCircle2 size={24} className="text-emerald-300" /> },
                            { title: 'Accurate Calculations', icon: <CircleDollarSign size={24} className="text-emerald-300" /> },
                            { title: 'Secure Data Handling', icon: <ShieldCheck size={24} className="text-emerald-300" /> },
                            { title: 'Time Saving', icon: <Clock size={24} className="text-emerald-300" /> },
                            { title: 'Organized Records', icon: <FolderOpen size={24} className="text-emerald-300" /> }
                        ].map((item, i) => (
                            <div key={i} className="bg-emerald-800/50 backdrop-blur-sm border border-emerald-700 px-6 py-4 rounded-xl flex items-center gap-4 hover:bg-emerald-800 transition-colors">
                                {item.icon}
                                <span className="text-lg font-bold">{item.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="py-12 bg-white border-t border-emerald-50 text-emerald-800/50">
                <div className="max-w-6xl mx-auto px-6 text-center text-sm font-bold">
                    <p>© {new Date().getFullYear()} PayRollHub • All Rights Reserved</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
