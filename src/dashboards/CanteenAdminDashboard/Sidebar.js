import React from 'react';

const Sidebar = ({ setPage }) => (
  <div className="w-64 h-screen bg-gradient-to-b from-teal-500 via-teal-300 to-blue-400 text-white flex flex-col rounded-l-2xl shadow-lg">
    <div className="p-6 text-2xl font-bold text-white">Canteen Admin</div>
    <nav className="flex-1">
      <ul>
        <li className="p-4 hover:bg-teal-200 cursor-pointer text-white" onClick={() => setPage('dashboard')}>Dashboard</li>
        <li className="p-4 hover:bg-teal-200 cursor-pointer text-white" onClick={() => setPage('menu')}>Menu Management</li>
        <li className="p-4 hover:bg-teal-200 cursor-pointer text-white" onClick={() => setPage('requests')}>Food Requests</li>
        <li className="p-4 hover:bg-teal-200 cursor-pointer text-white" onClick={() => setPage('users')}>Users</li>
        <li className="p-4 hover:bg-teal-200 cursor-pointer text-white" onClick={() => setPage('logout')}>Logout</li>
      </ul>
    </nav>
  </div>
);

export default Sidebar;