import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        console.log('Fetched users:', response.data); // Debugging log
      } catch (err) {
        console.error('Error fetching users:', err.response ? err.response.data : err.message);
        alert(`Error fetching users: ${err.response ? err.response.data.msg : err.message}`);
      }
    };
    fetchUsers();
  }, [token]);

  const removeUser = async (userId) => {
    if (window.confirm('Are you sure you want to remove this user? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.filter(user => user._id !== userId));
        alert('User removed successfully!');
      } catch (err) {
        console.error('Error removing user:', err.response ? err.response.data : err.message);
        alert(`Error removing user: ${err.response ? err.response.data.msg : err.message}`);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-8">
      <h1 className="text-4xl font-bold mb-8 text-teal-700">User Management</h1>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-xl overflow-hidden shadow-md">
            <thead className="bg-gradient-to-r from-[#00A3E0] to-[#007BFF] text-white">
              <tr>
                <th className="py-3 px-5 text-left font-semibold">Name</th>
                <th className="py-3 px-5 text-left font-semibold">Email</th>
                <th className="py-3 px-5 text-left font-semibold">Role</th>
                <th className="py-3 px-5 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {users.map(user => (
                <tr key={user._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-5">{user.name || 'N/A'}</td>
                  <td className="py-3 px-5">{user.email}</td>
                  <td className="py-3 px-5 capitalize">{user.role}</td>
                  <td className="py-3 px-5">
                    {user.role === 'employee' && (
                      <button
                        onClick={() => removeUser(user._id)}
                        className="bg-red-500 text-white py-1 px-4 rounded-xl hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <p className="text-gray-500 text-center mt-6 italic">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default UsersAdmin;