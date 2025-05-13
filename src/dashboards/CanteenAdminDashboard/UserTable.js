import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderHistoryModal = ({ email, onClose }) => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/canteen/order-history/${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching order history:', err.response ? err.response.data : err.message);
        alert(`Error fetching order history: ${err.response ? err.response.data.msg : err.message}`);
      }
    };
    fetchOrderHistory();
  }, [email, token]);

  const updateOrderStatus = async (orderId, status, adminMessage = '') => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/canteen/order/${orderId}`,
        { status, adminMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(orders.map(o => o._id === orderId ? response.data.order : o));
      alert('Order status updated successfully!');
    } catch (err) {
      console.error('Error updating order status:', err.response ? err.response.data : err.message);
      alert(`Error updating order status: ${err.response ? err.response.data.msg : err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-11/12 md:w-3/4 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-[#2E7D7A]">Order History for {email}</h2>
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-xl overflow-hidden shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/8">Food Name</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/8">Quantity</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/8">Price</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/8">Total</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/8">Status</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/8">Admin Message</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/8">Date</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/8">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 border-t">{order.foodName}</td>
                    <td className="py-4 px-4 border-t">{order.quantity}</td>
                    <td className="py-4 px-4 border-t">${order.price}</td>
                    <td className="py-4 px-4 border-t">${order.total}</td>
                    <td className="py-4 px-4 border-t">{order.status}</td>
                    <td className="py-4 px-4 border-t">{order.adminMessage || 'N/A'}</td>
                    <td className="py-4 px-4 border-t">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="py-4 px-4 border-t">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order._id, 'approved')}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-xl mr-2 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              const message = prompt('Enter decline reason:');
                              if (message) updateOrderStatus(order._id, 'declined', message);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-xl transition-colors"
                          >
                            Decline
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center italic mt-4">No orders found for this user.</p>
        )}
        <button
          onClick={onClose}
          className="mt-6 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-xl transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err.response ? err.response.data : err.message);
        alert(`Error fetching users: ${err.response ? err.response.data.msg : err.message}`);
      }
    };
    fetchUsers();
  }, [token]);

  const viewOrderHistory = (email) => {
    setSelectedUser(email);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-[#2E7D7A]">Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-xl overflow-hidden shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/4">Name</th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/4">Email</th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/4">Role</th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/4">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {users.map(user => (
              <tr key={user.email} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 border-t">{user.name}</td>
                <td className="py-4 px-4 border-t">{user.email}</td>
                <td className="py-4 px-4 border-t">{user.role}</td>
                <td className="py-4 px-4 border-t">
                  <button
                    onClick={() => viewOrderHistory(user.email)}
                    className="bg-[#2E7D7A] hover:bg-[#236B68] text-white px-4 py-2 rounded-xl transition-colors"
                  >
                    View Order History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedUser && <OrderHistoryModal email={selectedUser} onClose={closeModal} />}
    </div>
  );
};

export default UserTable;
