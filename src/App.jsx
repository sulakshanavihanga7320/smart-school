import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import InstituteProfile from './pages/InstituteProfile';
import LiveClass from './pages/LiveClass';
import Chat from './pages/Chat';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import './App.css';

const LoadingScreen = () => (
  <div className="loading-screen" style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--surface)',
    color: 'white'
  }}>
    <div className="logo-icon animate-pulse" style={{ width: '60px', height: '60px', fontSize: '2rem', marginBottom: '1rem' }}>S</div>
    <div className="spinner"></div>
    <p style={{ marginTop: '1rem', opacity: 0.6 }}>Initializing SMVSMS...</p>
  </div>
);

const PagePlaceholder = () => {
  const location = useLocation();
  const path = location.pathname.split('/').filter(Boolean).join(' > ');

  return (
    <div className="animate-fade-in">
      <h1 className="text-gradient" style={{ textTransform: 'capitalize' }}>
        {path.replace(/-/g, ' ') || 'Dashboard'}
      </h1>
      <div className="card" style={{ marginTop: '2rem', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="text-muted">Content for {path || 'Dashboard'} is coming soon...</p>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, userRole } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Login />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <div className="access-denied">
      <h2>Access Denied</h2>
      <p>You do not have permission to view this page.</p>
    </div>;
  }

  return children;
};

const AppRoutes = () => {
  const { loading, user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={loading ? <LoadingScreen /> : <Dashboard />} />

        {/* Admin Only */}
        <Route path="settings/profile" element={<ProtectedRoute allowedRoles={['admin']}><InstituteProfile /></ProtectedRoute>} />
        <Route path="settings/*" element={<ProtectedRoute allowedRoles={['admin']}><PagePlaceholder /></ProtectedRoute>} />
        <Route path="employees/*" element={<ProtectedRoute allowedRoles={['admin']}><PagePlaceholder /></ProtectedRoute>} />
        <Route path="accounts/*" element={<ProtectedRoute allowedRoles={['admin']}><PagePlaceholder /></ProtectedRoute>} />
        <Route path="whatsapp/*" element={<ProtectedRoute allowedRoles={['admin']}><PagePlaceholder /></ProtectedRoute>} />
        <Route path="messaging/*" element={<ProtectedRoute allowedRoles={['admin']}><PagePlaceholder /></ProtectedRoute>} />

        {/* Admin & Teacher & Student (Selective) */}
        <Route path="classes/*" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><PagePlaceholder /></ProtectedRoute>} />
        <Route path="subjects/*" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><PagePlaceholder /></ProtectedRoute>} />
        <Route path="students/*" element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}><PagePlaceholder /></ProtectedRoute>} />
        <Route path="reports/*" element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}><PagePlaceholder /></ProtectedRoute>} />

        {/* Multi-role */}
        <Route path="fees/*" element={<ProtectedRoute allowedRoles={['admin', 'parent', 'student']}><PagePlaceholder /></ProtectedRoute>} />
        <Route path="attendance/*" element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'parent']}><PagePlaceholder /></ProtectedRoute>} />
        <Route path="timetable/*" element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'parent']}><PagePlaceholder /></ProtectedRoute>} />
        <Route path="homework/*" element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'parent']}><PagePlaceholder /></ProtectedRoute>} />
        <Route path="behaviour/*" element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'parent']}><PagePlaceholder /></ProtectedRoute>} />
        <Route path="live-class" element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}><LiveClass /></ProtectedRoute>} />
        <Route path="chat" element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'parent']}><Chat /></ProtectedRoute>} />
        <Route path="exams/*" element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'parent']}><PagePlaceholder /></ProtectedRoute>} />

        <Route path="*" element={<PagePlaceholder />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
