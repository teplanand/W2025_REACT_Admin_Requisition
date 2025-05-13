import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LeaveApplication() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [leaveType, setLeaveType] = useState('Sick Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || role !== 'employee') {
    navigate('/login');
    return null;
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setName(data.name);
          setEmail(data.email);
        } else {
          setError(data.msg || 'Error fetching profile');
        }
      } catch (err) {
        setError('Error connecting to server');
      }
    };
    fetchProfile();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be before start date');
      setSuccess('');
      return;
    }

    const mappedLeaveType =
      leaveType === 'Sick Leave' ? 'Sick' :
      leaveType === 'Casual Leave' ? 'Personal' :
      leaveType === 'Annual Leave' ? 'Vacation' : 'Other';

    try {
      const response = await fetch('http://localhost:5000/api/leave/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          leaveType: mappedLeaveType,
          startDate,
          endDate,
          reason,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Leave request submitted successfully');
        setError('');
        setLeaveType('Sick Leave');
        setStartDate('');
        setEndDate('');
        setReason('');
      } else {
        setError(data.msg || 'Error submitting leave request');
        setSuccess('');
      }
    } catch (err) {
      setError('Error connecting to server');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-[#00A3E0] to-[#007BFF] text-white px-6 py-4 shadow-lg flex justify-between items-center">
        <h1 className="text-xl font-semibold">Employee Dashboard</h1>
        <button
          onClick={() => navigate('/employee-dashboard')}
          className="bg-white text-teal-700 font-semibold px-4 py-2 rounded-xl hover:bg-teal-50 transition-colors"
        >
          Home
        </button>
      </nav>

      {/* Form Section */}
      <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-white bg-gradient-to-r from-[#00A3E0] to-[#007BFF] py-3 px-4 rounded-xl">
          Apply for Leave
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">Name</label>
            <input
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
              id="name"
              type="text"
              value={name}
              readOnly
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
            <input
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
              id="email"
              type="email"
              value={email}
              readOnly
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="leaveType">Leave Type</label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
              id="leaveType"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
            >
              <option>Sick Leave</option>
              <option>Casual Leave</option>
              <option>Annual Leave</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="startDate">Start Date</label>
            <input
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="endDate">End Date</label>
            <input
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="reason">Reason</label>
            <textarea
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
              id="reason"
              rows="4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 mb-6 text-center">{error}</p>}
          {success && <p className="text-green-500 mb-6 text-center">{success}</p>}
          <button
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default LeaveApplication;