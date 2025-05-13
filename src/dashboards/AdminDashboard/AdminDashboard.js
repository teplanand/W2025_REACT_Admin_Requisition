import React, { useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!token || role !== 'admin') {
      navigate('/login');
    }
  }, [navigate, token, role]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-[#5BE584] to-[#00AB55] text-white p-6 fixed top-0 left-0 h-full shadow-xl z-10 rounded-tr-3xl rounded-br-3xl">
        <h2 className="text-2xl font-bold mb-10 tracking-wide">Admin Panel</h2>
        <nav className="flex-1">
          <ul className="space-y-6">
            <li>
              <Link to="/admin-dashboard" className="flex items-center py-2 px-4 rounded-xl hover:bg-white hover:text-green-700 transition">
                <i className="fas fa-home mr-3"></i> Home
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/users" className="flex items-center py-2 px-4 rounded-xl hover:bg-white hover:text-green-700 transition">
                <i className="fas fa-users mr-3"></i> Users
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="flex items-center w-full text-left py-2 px-4 rounded-xl hover:bg-white hover:text-green-700 transition">
                <i className="fas fa-sign-out-alt mr-3"></i> Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 pl-8 pr-8 pt-8 flex-1">
        <Outlet />
        {location.pathname === '/admin-dashboard' && (
          <>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-10">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Welcome Card */}
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
                <h3 className="text-xl font-semibold text-gray-700">Welcome Admin</h3>
                <p className="text-gray-500 mt-2">You're logged in with administrative privileges.</p>
              </div>

              {/* Leave Tracker */}
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-2xl transition text-center">
                <h3 className="text-lg font-semibold text-green-600">Leave Tracker</h3>
                <p className="text-gray-500 mt-2">Manage employee leave requests.</p>
                <Link to="/admin-dashboard/leave-requests">
                  <button className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-xl transition">
                    View Leaves
                  </button>
                </Link>
              </div>

              {/* Task Management */}
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-2xl transition text-center">
                <h3 className="text-lg font-semibold text-blue-600">Task Management</h3>
                <p className="text-gray-500 mt-2">Manage tasks and projects efficiently.</p>
                <Link to="/admin-dashboard/task-management">
                  <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-xl transition">
                    Manage Tasks
                  </button>
                </Link>
              </div>

              {/* Canteen Management */}
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-2xl transition text-center">
                <h3 className="text-lg font-semibold text-yellow-500">Canteen Management</h3>
                <p className="text-gray-500 mt-2">Today's menu, orders, and balance.</p>
                <Link to="/admin-dashboard/canteen">
                  <button className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-6 rounded-xl transition">
                    View Canteen
                  </button>
                </Link>
              </div>

              {/* Alerts */}
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-2xl transition text-center">
                <h3 className="text-lg font-semibold text-red-500">Alerts Management</h3>
                <p className="text-gray-500 mt-2">Send important alerts to staff.</p>
                <Link to="/admin-dashboard/alerts">
                  <button className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-xl transition">
                    Manage Alerts
                  </button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
