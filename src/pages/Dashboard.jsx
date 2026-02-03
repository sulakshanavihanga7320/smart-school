import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, Briefcase, CreditCard, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import StudentDashboard from './StudentDashboard';
import './Dashboard.css';
import './CalendarCustom.css';

const StatCard = ({ icon: Icon, label, value, color, loading }) => (
    <div className="card stat-card">
        <div className="stat-icon" style={{ backgroundColor: `${color}20`, color: color }}>
            <Icon size={24} />
        </div>
        <div className="stat-info">
            <h3>{loading ? '...' : value}</h3>
            <p>{label}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const { userRole } = useAuth();
    const [stats, setStats] = useState({
        students: 0,
        teachers: 0,
        staff: 0,
        fees: 0,
        loading: true
    });
    const [attendanceData, setAttendanceData] = useState([]);
    const [classAttendance, setClassAttendance] = useState([]);
    const [employeeAttendance, setEmployeeAttendance] = useState({ present: 0, total: 0 });
    const [newAdmissions, setNewAdmissions] = useState([]);
    const [absentStudents, setAbsentStudents] = useState([]);
    const [activities, setActivities] = useState([]);

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const todayISO = new Date().toISOString().split('T')[0];

    const isAdmin = userRole === 'admin' || !userRole;
    const isTeacher = userRole === 'teacher';
    const isStudent = userRole === 'student';
    const isParent = userRole === 'parent';

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setStats(prev => ({ ...prev, loading: true }));

            // 1. Basic Stats
            const { count: studentCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
            const { count: teacherCount } = await supabase.from('employees').select('*', { count: 'exact', head: true }).eq('role', 'teacher');
            const { count: staffCount } = await supabase.from('employees').select('*', { count: 'exact', head: true }).neq('role', 'teacher');
            const { data: feesData } = await supabase.from('fees').select('amount');
            const totalFees = feesData?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

            setStats({
                students: studentCount || 0,
                teachers: teacherCount || 0,
                staff: staffCount || 0,
                fees: totalFees,
                loading: false
            });

            // 2. New Admissions (Last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const { data: recentStudents } = await supabase
                .from('students')
                .select('*')
                .gte('created_at', thirtyDaysAgo.toISOString())
                .order('created_at', { ascending: false })
                .limit(5);
            setNewAdmissions(recentStudents || []);

            // 3. Absent Students (Today)
            const { data: absentData } = await supabase
                .from('student_attendance')
                .select(`
                    id,
                    student_id,
                    status,
                    students (
                        full_name,
                        class_name
                    )
                `)
                .eq('date', todayISO)
                .eq('status', 'absent');

            setAbsentStudents(absentData || []);

            // 4. Class-wise Attendance
            const { data: classAttData } = await supabase
                .from('student_attendance')
                .select('class_name, status')
                .eq('date', todayISO);

            const classMap = classAttData?.reduce((acc, curr) => {
                const className = curr.class_name || 'Unassigned';
                if (!acc[className]) acc[className] = { total: 0, present: 0 };
                acc[className].total++;
                if (curr.status === 'present') acc[className].present++;
                return acc;
            }, {}) || {};

            setClassAttendance(Object.keys(classMap).map(name => ({
                name,
                ...classMap[name]
            })));

            // 5. Employee attendance
            const { data: empAttData } = await supabase
                .from('employee_attendance')
                .select('status')
                .eq('date', todayISO);

            setEmployeeAttendance({
                present: empAttData?.filter(a => a.status === 'present').length || 0,
                total: (teacherCount || 0) + (staffCount || 0) || 1
            });

            // Demo Attendance Chart Data
            setAttendanceData([
                { name: 'Mon', value: 45 }, { name: 'Tue', value: 52 }, { name: 'Wed', value: 48 },
                { name: 'Thu', value: 61 }, { name: 'Fri', value: 55 }, { name: 'Sat', value: 40 }, { name: 'Sun', value: 0 }
            ]);

            const { data: actData } = await supabase.from('activities').select('*').order('created_at', { ascending: false }).limit(5);
            setActivities(actData || []);

        } catch (err) {
            console.error('Error:', err);
            setStats(prev => ({ ...prev, loading: false }));
        }
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    const absentStudentCount = absentStudents.length;
    const presentStudentCount = Math.max(0, stats.students - absentStudentCount);
    const pieData = [
        { name: 'Present', value: presentStudentCount, color: 'var(--secondary)' },
        { name: 'Absent', value: absentStudentCount, color: '#ef4444' }
    ];

    // Mock data for student portal demo
    const studentProfile = {
        full_name: 'vihanga sulakshana',
        reg_no: '7320',
        admission_date: '16 December, 2025',
        class_name: '6 garde',
        discount: '2147483647 %',
        dob: '23 January, 2008',
        gender: 'male',
        blood_group: 'A+',
        nic: '200880231753',
        father_name: 'jayantha',
        mother_name: 'iroshini',
        address: 'athdathkalla, pemaduwa'
    };

    if (isStudent) {
        return <StudentDashboard studentData={studentProfile} />;
    }

    return (
        <div className="dashboard animate-fade-in">
            <div className="dashboard-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 className="text-gradient">
                            {isAdmin ? 'School Overview' :
                                isTeacher ? 'Teacher Portal' :
                                    isStudent ? 'Student Portal' : 'Parent Portal'}
                        </h1>
                        <p className="text-muted">
                            {isAdmin ? 'Live system monitoring and analytics.' :
                                `Welcome to your personalized ${userRole} dashboard.`}
                        </p>
                    </div>
                    <div className="date-display text-muted" style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                        <Clock size={16} style={{ marginRight: '8px' }} />
                        {currentDate}
                    </div>
                </div>
            </div>

            <div className="stats-grid">
                {(isAdmin || isTeacher) && (
                    <StatCard icon={GraduationCap} label="Total Students" value={stats.students} color="#6366f1" loading={stats.loading} />
                )}
                {isAdmin && (
                    <>
                        <StatCard icon={Users} label="Total Teachers" value={stats.teachers} color="#10b981" loading={stats.loading} />
                        <StatCard icon={Briefcase} label="Total Staff" value={stats.staff} color="#f59e0b" loading={stats.loading} />
                        <StatCard icon={CreditCard} label="Fees Collected" value={formatCurrency(stats.fees)} color="#ec4899" loading={stats.loading} />
                    </>
                )}
                {(isStudent || isParent) && (
                    <>
                        <StatCard icon={GraduationCap} label="Grade" value="10-A" color="#6366f1" />
                        <StatCard icon={Clock} label="Attendance" value="94%" color="#10b981" />
                        <StatCard icon={CreditCard} label="Fees Status" value="Paid" color="#ec4899" />
                    </>
                )}
            </div>

            <div className="dashboard-grid main-grid">
                <div className="dashboard-main-column">
                    {/* New Admission and Absentees Summary */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div className="card">
                            <h3>New Admissions</h3>
                            <div className="new-admissions-list" style={{ marginTop: '1.25rem' }}>
                                {newAdmissions.length > 0 ? newAdmissions.map(student => (
                                    <div key={student.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <GraduationCap size={16} />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{student.full_name}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class: {student.class_name}</p>
                                        </div>
                                    </div>
                                )) : <p className="text-muted" style={{ padding: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>No new admissions in the last 30 days.</p>}
                            </div>
                        </div>

                        <div className="card">
                            <h3>Absentees Overview</h3>
                            <div style={{ height: '180px', width: '100%', position: 'relative' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={75}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                    <p style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>{absentStudentCount}</p>
                                    <p style={{ fontSize: '0.65rem', color: '#ef4444', fontWeight: '600' }}>ABSENT</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)' }}></div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Present</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Absent</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card chart-container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3>Monthly Attendance Trends</h3>
                            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Overall History</span>
                        </div>
                        <div style={{ height: '280px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={attendanceData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: 'var(--glass)' }}
                                        contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {attendanceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === attendanceData.length - 1 ? 'var(--primary)' : 'var(--surface-light)'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="attendance-snapshot-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                <h3>Student Presence (by Class)</h3>
                                <span className="badge" style={{ fontSize: '0.7rem', background: 'var(--primary)', padding: '2px 8px', borderRadius: '10px' }}>Today</span>
                            </div>
                            <div className="class-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {classAttendance.length > 0 ? classAttendance.map(item => (
                                    <div key={item.name} className="class-att-item">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                                            <span>{item.name}</span>
                                            <span className="text-muted">{item.present}/{item.total}</span>
                                        </div>
                                        <div className="progress-bg" style={{ height: '6px', background: 'var(--surface-light)', borderRadius: '10px' }}>
                                            <div
                                                className="progress-fill"
                                                style={{
                                                    height: '100%',
                                                    width: `${Math.round((item.present / item.total) * 100)}%`,
                                                    background: 'var(--secondary)',
                                                    borderRadius: '10px'
                                                }}
                                            />
                                        </div>
                                    </div>
                                )) : <p className="text-muted" style={{ textAlign: 'center', padding: '1rem', fontSize: '0.85rem' }}>No records found.</p>}
                            </div>
                        </div>

                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                <h3>Absentees List</h3>
                                <div style={{ padding: '2px 8px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.7rem', fontWeight: '600' }}>
                                    TODAY
                                </div>
                            </div>
                            <div className="absent-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '5px' }}>
                                {absentStudents.length > 0 ? absentStudents.map(item => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '10px', borderLeft: '3px solid #ef4444' }}>
                                        <div>
                                            <p style={{ fontSize: '0.85rem', fontWeight: '600', margin: 0 }}>{item.students?.full_name}</p>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>{item.students?.class_name || 'N/A'}</p>
                                        </div>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#ef4444' }}>ABSENT</span>
                                    </div>
                                )) : <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>Perfect attendance! No students absent today.</p>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-side-grid">
                    <div className="card calendar-card">
                        <div style={{ marginBottom: '1rem' }}>
                            <h3>School Calendar</h3>
                        </div>
                        <Calendar className="custom-calendar" />
                    </div>

                    <div className="card recent-activity">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3>Recent Activity</h3>
                            <button className="text-primary-btn" onClick={fetchDashboardData} style={{ fontSize: '0.8rem', background: 'none', color: 'var(--primary)', border: 'none', cursor: 'pointer' }}>
                                Refresh
                            </button>
                        </div>
                        <div className="activity-list">
                            {activities.length > 0 ? activities.map(item => (
                                <div key={item.id} className="activity-item">
                                    <div className="activity-icon">
                                        <Clock size={16} />
                                    </div>
                                    <div className="activity-details">
                                        <p>{item.description}</p>
                                        <span>{new Date(item.created_at).toLocaleString()}</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="empty-state" style={{ textAlign: 'center', padding: '1rem' }}>
                                    <AlertCircle size={24} className="text-muted" style={{ marginBottom: '0.5rem' }} />
                                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>No recent activities found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
