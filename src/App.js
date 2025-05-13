import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import EmployeeDashboard from './dashboards/EmployeeDashboard/EmployeeDashboard';
import AdminDashboard from './dashboards/AdminDashboard/AdminDashboard';
import CanteenAdminDashboard from './dashboards/CanteenAdminDashboard/CanteenAdminDashboard';
import LeaveApplication from './dashboards/EmployeeDashboard/LeaveApplication';
import LeaveRequests from './dashboards/AdminDashboard/LeaveRequests';
import LeaveHistory from './dashboards/EmployeeDashboard/LeaveHistory';
import TaskManagement from './dashboards/AdminDashboard/TaskManagement';
import EmployeeTaskManagement from './dashboards/EmployeeDashboard/EmployeeTaskManagement';
import CanteenPage from './dashboards/EmployeeDashboard/CanteenPage';
import UsersAdmin from './dashboards/AdminDashboard/UsersAdmin';
import AlertManagement from './dashboards/AdminDashboard/AlertManagement'; // New Alert Management Component

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" state={{ from: location, message: 'Unauthorized access' }} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="users" element={<UsersAdmin />} />
          <Route path="leave-requests" element={<LeaveRequests />} />
          <Route path="task-management" element={<TaskManagement />} />
          <Route path="canteen" element={<CanteenPage />} />
          <Route path="alerts" element={<AlertManagement />} /> {/* Add Alerts route */}
        </Route>
        <Route
          path="/canteen-admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['canteenAdmin']}>
              <CanteenAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<div>About Page (Placeholder)</div>} />
        <Route
          path="/employee-dashboard/leave-application"
          element={
            <ProtectedRoute allowedRoles={['employee']}>
              <LeaveApplication />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-dashboard/leave-history"
          element={
            <ProtectedRoute allowedRoles={['employee']}>
              <LeaveHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-dashboard/task-management"
          element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeTaskManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-dashboard/canteen"
          element={
            <ProtectedRoute allowedRoles={['employee']}>
              <CanteenPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;