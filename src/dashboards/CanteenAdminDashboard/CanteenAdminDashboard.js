import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import MenuManagement from './MenuManagement';
import FoodRequests from './FoodRequests';
import UserTable from './UserTable';

const CanteenAdminDashboard = () => {
  const [page, setPage] = useState('dashboard');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!token || role !== 'canteenAdmin') {
      navigate('/login');
    }
  }, [token, role, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Optional: Keep the re-render effect if other components need periodic updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPage(page); // Trigger re-render (can be removed if not needed)
    }, 1000);
    return () => clearInterval(interval);
  }, [page]);

  if (page === 'logout') {
    handleLogout();
    return null;
  }

  return (
    <div className="flex">
      <Sidebar setPage={setPage} />
      <div className="flex-1 p-4">
        {page === 'dashboard' && <Dashboard />}
        {page === 'menu' && <MenuManagement />}
        {page === 'requests' && <FoodRequests />}
        {page === 'users' && <UserTable />}
      </div>
    </div>
  );
};

export default CanteenAdminDashboard;