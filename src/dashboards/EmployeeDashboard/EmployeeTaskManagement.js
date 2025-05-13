import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EmployeeTaskManagement() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!token || role !== 'employee') {
      navigate('/login');
    }
  }, [token, role, navigate]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks/employee', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setTasks(data);
      } else {
        setError(data.msg || 'Error fetching tasks');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  const handleUpdateStatus = async (taskId, status, progress) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status, progress }),
      });
      const data = await response.json();
      if (response.ok) {
        fetchTasks();
      } else {
        setError(data.msg || 'Error updating task');
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
            Your Assigned Tasks
          </h2>
          {error && <p className="text-red-500 mb-6 text-center">{error}</p>}
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center italic">No tasks assigned to you.</p>
          ) : (
            <div className="space-y-6">
              {[...tasks].reverse().map((task) => (
                <div key={task._id} className="border p-6 rounded-2xl shadow-md hover:bg-gray-50 transition-colors">
                  <p className="text-gray-900"><strong className="font-semibold">Title:</strong> {task.title}</p>
                  <p className="text-gray-600"><strong className="font-semibold">Description:</strong> {task.description}</p>
                  <p className="text-gray-600"><strong className="font-semibold">Start Date:</strong> {new Date(task.startDate).toLocaleDateString()}</p>
                  <p className="text-gray-600"><strong className="font-semibold">End Date:</strong> {new Date(task.endDate).toLocaleDateString()}</p>
                  <p className="text-gray-600"><strong className="font-semibold">Status:</strong> {task.status}</p>
                  <p className="text-gray-600"><strong className="font-semibold">Progress:</strong> {task.progress}%</p>
                  <div className="mt-4">
                    <label className="block text-gray-700 font-semibold mb-2">Update Status:</label>
                    <select
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
                      value={task.status}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        const newProgress =
                          newStatus === 'Done' ? 100 : newStatus === 'In Progress' ? 50 : 0;
                        handleUpdateStatus(task._id, newStatus, newProgress);
                      }}
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Done</option>
                    </select>
                  </div>
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

export default EmployeeTaskManagement;