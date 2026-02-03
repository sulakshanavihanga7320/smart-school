import React from 'react';
import {
    User,
    MapPin,
    Calendar,
    Phone,
    Mail,
    Briefcase,
    History,
    ShieldCheck,
    Award,
    BookOpen,
    PieChart as PieIcon,
    ClipboardList,
    CreditCard,
    FileText
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';
import './StudentDashboard.css';

const StudentDashboard = ({ studentData }) => {
    // Demo data matching user's request
    const attendancePie = [
        { name: 'Present', value: 1, color: '#6366f1' },
        { name: 'Absent', value: 0, color: '#ef4444' },
        { name: 'Leave', value: 0, color: '#f59e0b' }
    ];

    const testReportData = [
        { name: 'Science', score: 0, total: 100 }
    ];

    return (
        <div className="student-portal animate-fade-in">
            <div className="portal-grid">
                {/* Left Profile Column */}
                <aside className="student-profile-card glass">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=vihanga" alt="Student" />
                        </div>
                        <h2>{studentData.full_name || 'vihanga sulakshana'}</h2>
                    </div>

                    <div className="profile-details">
                        <DetailItem label="Registration No" value={studentData.reg_no || '7320'} icon={ShieldCheck} />
                        <DetailItem label="Date of Admission" value={studentData.admission_date || '16 December, 2025'} icon={Calendar} />
                        <DetailItem label="Class" value={studentData.class_name || '6 garde'} icon={BookOpen} />
                        <DetailItem label="Discount in Fee" value={studentData.discount || '2147483647 %'} icon={CreditCard} />
                        <DetailItem label="Date of Birth" value={studentData.dob || '23 January, 2008'} icon={Calendar} />
                        <DetailItem label="Gender" value={studentData.gender || 'male'} icon={User} />
                        <DetailItem label="Blood Group" value={studentData.blood_group || 'A+'} icon={ShieldCheck} />
                        <DetailItem label="NIC / Birth ID" value={studentData.nic || '200880231753'} icon={FileText} />
                        <DetailItem label="Father Name" value={studentData.father_name || 'jayantha'} icon={User} />
                        <DetailItem label="Mother Name" value={studentData.mother_name || 'iroshini'} icon={User} />
                        <DetailItem label="Address" value={studentData.address || 'athdathkalla, pemaduwa'} icon={MapPin} />
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="portal-main">
                    <header className="portal-welcome glass">
                        <div className="welcome-text">
                            <span className="welcome-badge">Welcome {studentData.full_name || 'vihanga'} at Student Portal</span>
                            <h1>Siddhartha National Collage</h1>
                            <p>Anuradhapura</p>
                        </div>
                        <div className="welcome-illustration">
                            <img src="https://cdni.iconscout.com/illustration/premium/thumb/student-working-on-laptop-during-online-class-5207212-4348508.png" alt="Illustration" />
                        </div>
                    </header>

                    <div className="reports-grid">
                        {/* 1. Attendance Report */}
                        <section className="card report-card glass">
                            <div className="report-header">
                                <span className="report-index">1</span>
                                <h3>Attendance Report</h3>
                            </div>
                            <div className="report-content">
                                <div className="attendance-charts">
                                    <div className="chart-wrapper">
                                        <ResponsiveContainer width="100%" height={200}>
                                            <PieChart>
                                                <Pie
                                                    data={attendancePie}
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {attendancePie.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="chart-center">
                                            <span className="percentage">100%</span>
                                            <span className="label">Overall</span>
                                        </div>
                                    </div>
                                    <div className="month-stat glass">
                                        <span className="percentage">0%</span>
                                        <span className="label">Feb 2026</span>
                                    </div>
                                </div>

                                <div className="attendance-stats">
                                    <StatRow label="PRESENTS" value="1" color="#6366f1" />
                                    <StatRow label="LEAVES" value="0" color="#f59e0b" />
                                    <StatRow label="ABSENTS" value="0" color="#ef4444" />
                                </div>
                            </div>
                        </section>

                        {/* 2. Class Tests Report */}
                        <section className="card report-card glass">
                            <div className="report-header">
                                <span className="report-index">2</span>
                                <h3>Class Tests Report</h3>
                            </div>
                            <div className="report-content">
                                <div className="test-item">
                                    <div className="test-info">
                                        <BookOpen size={16} />
                                        <span>science</span>
                                        <span className="test-score">0%</span>
                                    </div>
                                    <div className="test-progress-bar">
                                        <div className="fill" style={{ width: '0%' }}></div>
                                    </div>
                                </div>

                                <div className="test-summary">
                                    <div className="summary-circular">
                                        <div className="circular-inner">
                                            <span className="score">0%</span>
                                            <span className="label">score</span>
                                        </div>
                                    </div>
                                    <div className="summary-list">
                                        <div className="sum-item">TOTAL CLASS TESTS: <span>0</span></div>
                                        <div className="sum-item">TOTAL MARKS: <span>0</span></div>
                                        <div className="sum-item">OBTAINED MARKS: <span>0</span></div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. Examination Report */}
                        <section className="card report-card glass">
                            <div className="report-header">
                                <span className="report-index">3</span>
                                <h3>Examination Report</h3>
                            </div>
                            <div className="empty-state">
                                <img src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-616.jpg" alt="No data" />
                                <p>No Record Found.</p>
                            </div>
                        </section>

                        {/* 4. Fee Report */}
                        <section className="card report-card glass">
                            <div className="report-header">
                                <span className="report-index">4</span>
                                <h3>Fee Report</h3>
                            </div>
                            <div className="empty-state">
                                <img src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-616.jpg" alt="No data" />
                                <p>No Record Found.</p>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value, icon: Icon }) => (
    <div className="detail-item">
        <div className="detail-icon"><Icon size={14} /></div>
        <div className="detail-info">
            <span className="label">{label}</span>
            <span className="value">{value}</span>
        </div>
    </div>
);

const StatRow = ({ label, value, color }) => (
    <div className="stat-row" style={{ backgroundColor: `${color}10`, borderTop: `2px solid ${color}` }}>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        <div className="stat-month">This Month: 0</div>
    </div>
);


export default StudentDashboard;
