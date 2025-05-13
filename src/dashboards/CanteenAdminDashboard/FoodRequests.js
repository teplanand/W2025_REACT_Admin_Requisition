import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FoodRequests = () => {
  const [orders, setOrders] = useState([]);
  const [selectedRequests, setSelectedRequests] = useState(new Set());
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/canteen/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sorted = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      console.log('Fetched orders:', sorted.map(o => ({ _id: o._id, status: o.status })));
      setOrders(sorted);
    } catch (err) {
      console.error('Error fetching orders:', err.response ? err.response.data : err.message);
      alert(`Error fetching orders: ${err.response ? err.response.data.msg : err.message}`);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/canteen/order/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Order updated:', response.data.order);
      fetchOrders(); // Force refresh after update
    } catch (err) {
      console.error(`Error updating order status to ${status}:`, err.response ? err.response.data : err.message);
      alert(`Error updating order: ${err.response ? err.response.data.msg : err.message}`);
    }
  };

  const handleSelectRequest = (id) => {
    const newSelected = new Set(selectedRequests);
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
    setSelectedRequests(newSelected);
  };

  // Separate orders into Pending, Approved, and Declined
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const approvedOrders = orders.filter(order => order.status === 'approved');
  const declinedOrders = orders.filter(order => order.status === 'declined');

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-[#2E7D7A]">Food Requests Overview</h2>

      {/* New Arrived Requests Section */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-6 text-white bg-gradient-to-r from-[#00A3E0] to-[#007BFF] py-3 px-4 rounded-xl">
          New Arrived Requests
        </h3>
        {pendingOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-xl overflow-hidden shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/6">Request ID</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/6">User</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/6">Food Item</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/6">Quantity</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/6">Date/Time</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/6">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {pendingOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 border-t text-[#2E7D7A]">REQ-{order._id.slice(-4)}</td>
                    <td className="py-4 px-4 border-t">{order.name}</td>
                    <td className="py-4 px-4 border-t">{order.foodName}</td>
                    <td className="py-4 px-4 border-t">{order.quantity}</td>
                    <td className="py-4 px-4 border-t">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-4 px-4 border-t">
                      <button
                        onClick={() => updateOrderStatus(order._id, 'approved')}
                        className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 mr-2 rounded-xl transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order._id, 'declined')}
                        className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-xl transition-colors"
                      >
                        Decline
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center italic mt-4">No new requests found.</p>
        )}
      </div>

      {/* Previous Approved or Declined Requests Section */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-6 text-white bg-gradient-to-r from-[#00A3E0] to-[#007BFF] py-3 px-4 rounded-xl">
          Previous Approved or Declined Requests
        </h3>
        {(approvedOrders.length > 0 || declinedOrders.length > 0) ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-xl overflow-hidden shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/7">Request ID</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/7">User</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/7">Food Item</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/7">Quantity</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/7">Date/Time</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/7">Status</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/7">Admin Message</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {approvedOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50 bg-green-50">
                    <td className="py-4 px-4 border-t text-green-600">REQ-{order._id.slice(-4)}</td>
                    <td className="py-4 px-4 border-t">{order.name}</td>
                    <td className="py-4 px-4 border-t">{order.foodName}</td>
                    <td className="py-4 px-4 border-t">{order.quantity}</td>
                    <td className="py-4 px-4 border-t">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-4 px-4 border-t capitalize text-green-600">{order.status}</td>
                    <td className="py-4 px-4 border-t">N/A</td>
                  </tr>
                ))}
                {declinedOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50 bg-red-50">
                    <td className="py-4 px-4 border-t text-red-600">REQ-{order._id.slice(-4)}</td>
                    <td className="py-4 px-4 border-t">{order.name}</td>
                    <td className="py-4 px-4 border-t">{order.foodName}</td>
                    <td className="py-4 px-4 border-t">{order.quantity}</td>
                    <td className="py-4 px-4 border-t">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-4 px-4 border-t capitalize text-red-600">{order.status}</td>
                    <td className="py-4 px-4 border-t">{order.adminMessage || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center italic mt-4">No previous requests found.</p>
        )}
      </div>
    </div>
  );
};

export default FoodRequests;