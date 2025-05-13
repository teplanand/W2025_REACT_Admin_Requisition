import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeaveRequestsAdmin = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeHistory, setEmployeeHistory] = useState([]);
  const [employees, setEmployees] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchLeaveRequests();
    fetchEmployees();
    const interval = setInterval(() => {
      fetchLeaveRequests();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/leave/admin', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sortedRequests = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setLeaveRequests(sortedRequests);
    } catch (err) {
      console.error('Error fetching leave requests:', err.response ? err.response.data : err.message);
      alert(`Error fetching leave requests: ${err.response ? err.response.data.msg : err.message}`);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err.response ? err.response.data : err.message);
      alert(`Error fetching employees: ${err.response ? err.response.data.msg : err.message}`);
    }
  };

  const fetchEmployeeHistory = async (email) => {
    if (!email) {
      setEmployeeHistory([]);
      setSelectedEmployee('');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/api/leave/history/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployeeHistory(response.data);
      setSelectedEmployee(email);
    } catch (err) {
      console.error('Error fetching employee leave history:', err.response ? err.response.data : err.message);
      alert(`Error fetching employee leave history: ${err.response ? err.response.data.msg : err.message}`);
    }
  };

  const updateLeaveStatus = async (id, status, adminMessage = '') => {
    try {
      await axios.put(
        `http://localhost:5000/api/leave/${id}`,
        { status, adminMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchLeaveRequests();
      if (selectedEmployee) fetchEmployeeHistory(selectedEmployee);
    } catch (err) {
      console.error('Error updating leave status:', err.response ? err.response.data : err.message);
      alert(`Error updating leave status: ${err.response ? err.response.data.msg : err.message}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-8">
      <h2 className="text-4xl font-bold mb-8 text-teal-700">Admin Leave Management</h2>

      {/* Employee Leave History Section */}
      <div className="mb-10 bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-2xl font-semibold mb-6 text-white bg-gradient-to-r from-[#00A3E0] to-[#007BFF] py-3 px-4 rounded-xl">
          Employee Leave History
        </h3>
        <select
          value={selectedEmployee}
          onChange={(e) => fetchEmployeeHistory(e.target.value)}
          className="w-full mb-6 p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
        >
          <option value="">Select Employee</option>
          {employees.map((employee) => (
            <option key={employee.email} value={employee.email}>
              {employee.name} ({employee.email})
            </option>
          ))}
        </select>

        {employeeHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-xl overflow-hidden shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-5 text-left text-gray-700 font-semibold">Leave Type</th>
                  <th className="py-3 px-5 text-left text-gray-700 font-semibold">Start Date</th>
                  <th className="py-3 px-5 text-left text-gray-700 font-semibold">End Date</th>
                  <th className="py-3 px-5 text-left text-gray-700 font-semibold">Reason</th>
                  <th className="py-3 px-5 text-left text-gray-700 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {employeeHistory.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-5 border-t">{request.leaveType}</td>
                    <td className="py-3 px-5 border-t">{new Date(request.startDate).toLocaleDateString()}</td>
                    <td className="py-3 px-5 border-t">{new Date(request.endDate).toLocaleDateString()}</td>
                    <td className="py-3 px-5 border-t">{request.reason}</td>
                    <td className="py-3 px-5 border-t capitalize">{request.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : selectedEmployee ? (
          <p className="text-gray-500 text-center italic mt-4">No leave history found for this employee.</p>
        ) : null}
      </div>

      {/* Leave Requests Section */}
      {leaveRequests.length > 0 ? (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-6 text-white bg-gradient-to-r from-[#00A3E0] to-[#007BFF] py-3 px-4 rounded-xl">
            Pending Leave Requests
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-xl overflow-hidden shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-5 text-left text-gray-700 font-semibold">Employee Email</th>
                  <th className="py-3 px-5 text-left text-gray-700 font-semibold">Leave Type</th>
                  <th className="py-3 px-5 text-left text-gray-700 font-semibold">Start Date</th>
                  <th className="py-3 px-5 text-left text-gray-700 font-semibold">End Date</th>
                  <th className="py-3 px-5 text-left text-gray-700 font-semibold">Reason</th>
                  <th className="py-3 px-5 text-left text-gray-700 font-semibold">Status</th>
                  <th className="py-3 px-5 text-left text-gray-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {leaveRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-5 border-t">{request.employeeEmail}</td>
                    <td className="py-3 px-5 border-t">{request.leaveType}</td>
                    <td className="py-3 px-5 border-t">{new Date(request.startDate).toLocaleDateString()}</td>
                    <td className="py-3 px-5 border-t">{new Date(request.endDate).toLocaleDateString()}</td>
                    <td className="py-3 px-5 border-t">{request.reason}</td>
                    <td className="py-3 px-5 border-t capitalize">{request.status}</td>
                    <td className="py-3 px-5 border-t">
                      {request.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const message = prompt('Enter approval message (optional):', 'Your leave has been approved.');
                              if (message !== null) {
                                updateLeaveStatus(request._id, 'approved', message);
                              }
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded-xl transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              const message = prompt('Enter decline reason:');
                              if (message) {
                                updateLeaveStatus(request._id, 'declined', message);
                              }
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded-xl transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-500">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-4 italic">No leave requests found.</p>
      )}
    </div>
  );
};

export default LeaveRequestsAdmin;