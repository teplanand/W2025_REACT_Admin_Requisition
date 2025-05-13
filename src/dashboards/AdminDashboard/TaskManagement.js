import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TaskManagement() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    assignedTo: '',
  });
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!token || role !== 'admin') {
      navigate('/login');
    }
  }, [token, role, navigate]);

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks/admin', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/employees', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError(err.message || 'Error connecting to server');
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/tasks/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) throw new Error(await response.text());
      await response.json();
      fetchTasks();
      setNewTask({ title: '', description: '', startDate: '', endDate: '', assignedTo: '' });
    } catch (err) {
      console.error('Error assigning task:', err);
      setError(err.message || 'Error connecting to server');
    }
  };

  const handleRemoveTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(await response.text());
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-8">
      <h1 className="text-4xl font-bold mb-8 text-teal-700">Task and Project Management</h1>

      {/* Task Assignment Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-white bg-gradient-to-r from-[#00A3E0] to-[#007BFF] py-3 px-4 rounded-xl">
          Task Assignment
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleAssignTask}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Title</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors resize-none"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              rows="4"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Start Date</label>
            <input
              type="date"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
              value={newTask.startDate}
              onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">End Date</label>
            <input
              type="date"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
              value={newTask.endDate}
              onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Assign To</label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.email} value={emp.email}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-teal-500 text-white py-3 px-6 rounded-xl hover:bg-teal-600 transition-colors duration-300 font-semibold"
          >
            Assign Task
          </button>
        </form>
      </div>

      {/* Task List Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-white bg-gradient-to-r from-[#00A3E0] to-[#007BFF] py-3 px-4 rounded-xl">
          Task List
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center italic">No tasks available.</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className="border-b border-gray-200 p-4 last:border-b-0 flex flex-col md:flex-row md:justify-between items-start md:items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong className="font-semibold">Assigned To:</strong> {task.assignedTo}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="font-semibold">Start:</strong>{' '}
                    {task.startDate?.slice(0, 10)} |{' '}
                    <strong className="font-semibold">End:</strong>{' '}
                    {task.endDate?.slice(0, 10)}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end gap-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      task.status === 'Done'
                        ? 'bg-green-100 text-green-700'
                        : task.status === 'In Progress'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {task.status || 'Pending'}
                  </span>
                  <button
                    onClick={() => handleRemoveTask(task._id)}
                    className="bg-red-500 text-white text-sm px-4 py-2 rounded-xl hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskManagement;