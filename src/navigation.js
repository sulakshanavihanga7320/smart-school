import {
  LayoutDashboard,
  Settings,
  BookOpen,
  Users,
  GraduationCap,
  Briefcase,
  CreditCard,
  ClipboardCheck,
  Calendar,
  Home,
  Heart,
  Smartphone,
  MessageSquare,
  Video,
  FileText,
  PenTool,
  FileSearch,
  Printer,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

export const navigation = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
    roles: ['admin', 'teacher', 'student', 'parent']
  },
  {
    name: 'General Settings',
    icon: Settings,
    roles: ['admin', 'student', 'teacher'], // Adjusted for sub-item roles
    children: [
      { name: 'Institute Profile', path: '/settings/profile', roles: ['admin'] },
      { name: 'Fees Particulars', path: '/settings/fees-particulars', roles: ['admin'] },
      { name: 'Fees Structure', path: '/settings/fees-structure', roles: ['admin'] },
      { name: 'Discount Type', path: '/settings/discount-type', roles: ['admin'] },
      { name: 'Accounts For Fees Invoice', path: '/settings/accounts', roles: ['admin'] },
      { name: 'Rules & Regulations', path: '/settings/rules', roles: ['admin'] },
      { name: 'Marks Grading', path: '/settings/grading', roles: ['admin'] },
      { name: 'Theme & Language', path: '/settings/theme', roles: ['admin'] },
      { name: 'Account Settings', path: '/settings/account', roles: ['admin', 'student', 'teacher'] },
      { name: 'Log out', path: '/logout', roles: ['admin', 'student', 'teacher'] }
    ]
  },
  {
    name: 'classes',
    icon: Home,
    roles: ['admin', 'teacher'],
    children: [
      { name: 'all classes', path: '/classes/all' },
      { name: 'new classes', path: '/classes/new', roles: ['admin'] }
    ]
  },
  {
    name: 'Subjects',
    icon: BookOpen,
    roles: ['admin', 'teacher'],
    children: [
      { name: 'Classes With Subjects', path: '/subjects/classes' },
      { name: 'Assign Subjects', path: '/subjects/assign', roles: ['admin'] }
    ]
  },
  {
    name: 'Students',
    icon: GraduationCap,
    roles: ['admin', 'teacher', 'student'],
    children: [
      { name: 'All Students', path: '/students/all', roles: ['admin', 'teacher'] },
      { name: 'Add New', path: '/students/new', roles: ['admin'] },
      { name: 'Manage Families', path: '/students/families', roles: ['admin'] },
      { name: 'Active / Inactive', path: '/students/status', roles: ['admin'] },
      { name: 'Admission Letter', path: '/students/admission-letter', roles: ['admin', 'student', 'teacher'] },
      { name: 'Student ID Cards', path: '/students/id-cards', roles: ['admin'] },
      { name: 'Print Basic List', path: '/students/print-list', roles: ['admin', 'teacher'] },
      { name: 'Manage Login', path: '/students/login', roles: ['admin'] },
      { name: 'Promote Students', path: '/students/promote', roles: ['admin'] }
    ]
  },
  {
    name: 'Employees',
    icon: Users,
    roles: ['admin'],
    children: [
      { name: 'All Employees', path: '/employees/all' },
      { name: 'Add New', path: '/employees/new' },
      { name: 'Staff ID Cards', path: '/employees/id-cards' },
      { name: 'Job Letter', path: '/employees/job-letter' },
      { name: 'Manage Login', path: '/employees/login' }
    ]
  },
  {
    name: 'Accounts',
    icon: CreditCard,
    roles: ['admin'],
    children: [
      { name: 'Chart Of Account', path: '/accounts/chart' },
      { name: 'Add Income', path: '/accounts/income' },
      { name: 'Add Expense', path: '/accounts/expense' },
      { name: 'Account Statement', path: '/accounts/statement' }
    ]
  },
  {
    name: 'Fees',
    icon: CreditCard,
    roles: ['admin', 'student'],
    children: [
      { name: 'Generate Fees Invoice', path: '/fees/generate', roles: ['admin'] },
      { name: 'Collect Fees', path: '/fees/collect', roles: ['admin'] },
      { name: 'Fees Paid Slip', path: '/fees/slip', roles: ['admin', 'student'] },
      { name: 'Fees Defaulters', path: '/fees/defaulters', roles: ['admin'] },
      { name: 'Fees Report', path: '/fees/report', roles: ['admin'] },
      { name: 'Delete Fees', path: '/fees/delete', roles: ['admin'] }
    ]
  },
  {
    name: 'Attendance',
    icon: ClipboardCheck,
    roles: ['admin', 'teacher', 'student'],
    children: [
      { name: 'Students Attendance', path: '/attendance/students', roles: ['admin', 'teacher'] },
      { name: 'Employees Attendance', path: '/attendance/employees', roles: ['admin'] },
      { name: 'Class wise Report', path: '/attendance/class-report', roles: ['admin', 'teacher'] },
      { name: 'Students Attendance Report', path: '/attendance/student-report', roles: ['admin', 'student', 'teacher'] },
      { name: 'Employees Attendance Report', path: '/attendance/employee-report', roles: ['admin'] }
    ]
  },
  {
    name: 'Timetable',
    icon: Calendar,
    roles: ['admin', 'teacher', 'student'],
    children: [
      { name: 'Weekdays', path: '/timetable/weekdays', roles: ['admin'] },
      { name: 'Time Periods', path: '/timetable/periods', roles: ['admin'] },
      { name: 'Class Rooms', path: '/timetable/rooms', roles: ['admin'] },
      { name: 'Create Timetable', path: '/timetable/create', roles: ['admin'] },
      { name: 'Generate For Class', path: '/timetable/class', roles: ['admin', 'student', 'teacher'] },
      { name: 'Generate For Teacher', path: '/timetable/teacher', roles: ['admin', 'teacher'] }
    ]
  },
  {
    name: 'Homework',
    icon: PenTool,
    path: '/homework',
    roles: ['admin', 'teacher', 'student']
  },
  {
    name: 'Behaviour & Skills',
    icon: Heart,
    roles: ['admin', 'teacher', 'student'],
    children: [
      { name: 'Rate Behaviours', path: '/behaviour/rate', roles: ['admin', 'teacher'] },
      { name: 'Rate Skills', path: '/behaviour/skills', roles: ['admin', 'teacher'] },
      { name: 'Observations', path: '/behaviour/observations', roles: ['admin', 'teacher'] },
      { name: 'Affective Domain Rating Report', path: '/behaviour/affective-report', roles: ['admin', 'teacher', 'student'] },
      { name: 'Psycomotor Domain Rating Report', path: '/behaviour/psycomotor-report', roles: ['admin', 'teacher', 'student'] }
    ]
  },
  {
    name: 'WhatsApp',
    icon: Smartphone,
    path: '/whatsapp',
    roles: ['admin']
  },
  {
    name: 'Messaging',
    icon: MessageSquare,
    roles: ['admin', 'teacher', 'student'],
    children: [
      { name: 'SMS Services', path: '/messaging/sms', roles: ['admin'] },
      { name: 'Free SMS Gateway', path: '/messaging/free-gateway', roles: ['admin'] },
      { name: 'Branded SMS', path: '/messaging/branded-sms', roles: ['admin'] },
      { name: 'SMS Templates', path: '/messaging/templates', roles: ['admin'] }
    ]
  },
  {
    name: 'Live Class',
    icon: Video,
    path: '/live-class',
    roles: ['admin', 'teacher', 'student']
  },
  {
    name: 'Question Paper',
    icon: FileText,
    roles: ['admin', 'teacher'],
    children: [
      { name: 'Subject Chapters', path: '/question-paper/chapters' },
      { name: 'Question Bank', path: '/question-paper/bank' },
      { name: 'Create Question Paper', path: '/question-paper/create' }
    ]
  },
  {
    name: 'Exams',
    icon: FileText,
    roles: ['admin', 'teacher', 'student'],
    children: [
      { name: 'Create New Exam', path: '/exams/new', roles: ['admin'] },
      { name: 'Add / update Exam Marks', path: '/exams/marks', roles: ['admin', 'teacher'] },
      { name: 'Result Card', path: '/exams/result-card', roles: ['admin', 'student', 'teacher'] },
      { name: 'Result Sheet', path: '/exams/result-sheet', roles: ['admin', 'teacher'] },
      { name: 'Exam Schedule', path: '/exams/schedule', roles: ['admin', 'student', 'teacher'] },
      { name: 'Date Sheet', path: '/exams/date-sheet', roles: ['admin', 'student', 'teacher'] },
      { name: 'Blank Award List', path: '/exams/award-list', roles: ['admin', 'teacher'] },
      { name: 'Exams', path: '/exams/all', roles: ['admin', 'teacher'] }
    ]
  },
  {
    name: 'Class Tests',
    icon: FileText,
    roles: ['admin', 'teacher', 'student'],
    children: [
      { name: 'Manage Test Marks', path: '/class-tests/marks', roles: ['admin', 'teacher'] },
      { name: 'Test Result', path: '/class-tests/result', roles: ['admin', 'student', 'teacher'] }
    ]
  },
  {
    name: 'Reports',
    icon: FileSearch,
    roles: ['admin', 'teacher', 'student'],
    children: [
      { name: 'Students report Card', path: '/reports/report-card', roles: ['admin', 'student', 'teacher'] },
      { name: 'Students info report', path: '/reports/student-info', roles: ['admin', 'teacher'] },
      { name: 'Parents info report', path: '/reports/parent-info', roles: ['admin', 'teacher'] },
      { name: 'Students Monthly Attendance Report', path: '/reports/student-attendance', roles: ['admin', 'student', 'teacher'] },
      { name: 'Staff Monthly Attendance Report', path: '/reports/staff-attendance', roles: ['admin'] },
      { name: 'Fee Collection Report', path: '/reports/fee-collection', roles: ['admin'] },
      { name: 'Student Progress Report', path: '/reports/student-progress', roles: ['admin', 'student', 'teacher'] },
      { name: 'Accounts Report', path: '/reports/accounts', roles: ['admin'] },
      { name: 'Customised Reports', path: '/reports/custom', roles: ['admin'] }
    ]
  },
  {
    name: 'Certificates',
    icon: Printer,
    roles: ['admin'],
    children: [
      { name: 'Generate Certificate', path: '/certificates/generate' },
      { name: 'Certificate Templates', path: '/certificates/templates' }
    ]
  }
];
