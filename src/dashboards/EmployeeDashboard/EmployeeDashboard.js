import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AlertList from './AlertList'; // Assuming you'll create this component

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    // Only redirect if token or role is invalid on initial render
    if (!token || role !== 'employee') {
      navigate('/login', { replace: true });
    }
  }, [navigate]); // Remove token and role from dependencies to prevent re-evaluation on changes

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login', { replace: true });
  };

  // Optional: Add a check to prevent rendering if not authenticated
  if (!token || role !== 'employee') {
    return null; // Prevent rendering until redirect occurs
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-[#00A3E0] to-[#007BFF] text-white p-6 fixed top-0 left-0 h-full shadow-lg z-10">
        <h2 className="text-2xl font-bold mb-8">Employee Panel</h2>
        <nav className="flex-1">
          <ul>
            <li className="mb-6">
              <Link to="/employee-dashboard" className="flex items-center py-3 px-4 text-white hover:bg-teal-500 rounded-xl transition-colors">
                <i className="fas fa-home mr-3"></i> Home
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="flex items-center w-full text-left py-3 px-4 text-white hover:bg-teal-500 rounded-xl transition-colors">
                <i className="fas fa-sign-out-alt mr-3"></i> Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6 flex-1">
        <h1 className="text-4xl font-bold mb-8 text-teal-700">Employee Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <h3 className="text-xl font-semibold text-teal-700 mb-4">Welcome Employee</h3>
            <p className="text-gray-600">You're logged in with employee privileges.</p>
          </div>

          {/* Leave Tracker */}
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <h3 className="text-xl font-semibold text-green-600 mb-4">Leave Tracker</h3>
            <p className="text-gray-600 mb-4">Check-in/out, view leave balances, and request time off.</p>
            <div className="flex flex-col gap-3">
              <Link to="/employee-dashboard/leave-application">
                <button className="w-full bg-green-500 text-white py-3 px-4 rounded-xl hover:bg-green-600 transition-colors">
                  Apply for Leave
                </button>
              </Link>
              <Link to="/employee-dashboard/leave-history">
                <button className="w-full bg-green-500 text-white py-3 px-4 rounded-xl hover:bg-green-600 transition-colors">
                  View Leave History
                </button>
              </Link>
            </div>
          </div>

          {/* Task Management */}
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">Task Management</h3>
            <p className="text-gray-600 mb-4">Manage tasks and projects efficiently.</p>
            <Link to="/employee-dashboard/task-management">
              <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 transition-colors">
                View Tasks
              </button>
            </Link>
          </div>

          {/* Canteen Management */}
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <h3 className="text-xl font-semibold text-yellow-500 mb-4">Canteen Management</h3>
            <p className="text-gray-600 mb-4">Today's menu, orders, and balance.</p>
            <Link to="/employee-dashboard/canteen">
              <button className="w-full bg-yellow-500 text-white py-3 px-4 rounded-xl hover:bg-yellow-600 transition-colors">
                View Canteen
              </button>
            </Link>
          </div>

          {/* Alerts Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center col-span-1 md:col-span-2 lg:col-span-3">
            <h3 className="text-xl font-semibold text-red-600 mb-4">Alerts</h3>
            <p className="text-gray-600 mb-4">View messages from admin.</p>
            <AlertList /> {/* Display alerts here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;