import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LeaveHistory() {
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [error, setError] = useState('');

  // Get token and role from local storage to verify user
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Redirect to login if no token or user role is not 'employee'
  if (!token || role !== 'employee') {
    navigate('/login');
    return null;
  }

  // Fetch leave requests on component mount
  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/leave/employee', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setLeaveRequests(data);
      } else {
        setError(data.msg || 'Error fetching leave requests');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-50 to-blue-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-[#00A3E0] to-[#007BFF] text-white px-6 py-4 shadow-lg flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Employee Dashboard</h1>
        <a
          href="/employee-dashboard"
          className="bg-white text-teal-700 font-semibold px-4 py-2 rounded-xl hover:bg-teal-50 transition-colors"
        >
          Home
        </a>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto flex-1 p-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-white bg-gradient-to-r from-[#00A3E0] to-[#007BFF] py-3 px-4 rounded-xl">
            Leave History
          </h2>

          {error && <p className="text-red-500 mb-6 text-center">{error}</p>}

          {leaveRequests.length === 0 ? (
            <p className="text-gray-500 text-center italic">No leave requests found.</p>
          ) : (
            <div className="space-y-6">
              {leaveRequests.map((request) => (
                <div key={request._id} className="border p-6 rounded-2xl shadow-md hover:bg-gray-50 transition-colors">
                  <p className="text-gray-900"><strong className="font-semibold">Leave Type:</strong> {request.leaveType}</p>
                  <p className="text-gray-600"><strong className="font-semibold">Start Date:</strong> {new Date(request.startDate).toLocaleDateString()}</p>
                  <p className="text-gray-600"><strong className="font-semibold">End Date:</strong> {new Date(request.endDate).toLocaleDateString()}</p>
                  <p className="text-gray-600"><strong className="font-semibold">Reason:</strong> {request.reason}</p>
                  <p className="text-gray-600"><strong className="font-semibold">Status:</strong> {request.status}</p>
                  {request.adminMessage && (
                    <p className="text-gray-600"><strong className="font-semibold">Admin Message:</strong> {request.adminMessage}</p>
                  )}
                  <p className="text-gray-600"><strong className="font-semibold">Requested On:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-teal-600 p-4 text-white text-center">
        <div className="container mx-auto">
          © {new Date().getFullYear()} Leave Application Dashboard. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default LeaveHistory;