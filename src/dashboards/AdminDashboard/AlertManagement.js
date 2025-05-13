import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AlertManagement = () => {
  const [message, setMessage] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [token] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!token || role !== 'admin') navigate('/login');
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [token, navigate, role]);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/alerts', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Sort alerts by sentAt in descending order (latest first)
      const sortedAlerts = response.data.sort(
        (a, b) => new Date(b.sentAt) - new Date(a.sentAt)
      );

      setAlerts(sortedAlerts);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  };

  const handleSendAlert = async (e) => {
    e.preventDefault();
    if (!message) {
      alert('Please enter a message.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/alerts',
        { message, sentTo: 'all' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.msg === 'Alert sent successfully') {
        setMessage('');
        fetchAlerts();
        alert('Alert sent successfully!');
      } else {
        alert(`Failed to send alert: ${response.data.msg || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error sending alert:', err);
      alert(`Error connecting to server: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-8">
      <h2 className="text-3xl font-bold mb-6 text-teal-700">Alert Management</h2>

      {/* Send Alert Form */}
      <form onSubmit={handleSendAlert} className="mb-10 bg-white p-6 rounded-2xl shadow-lg">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors mb-4 resize-none"
          placeholder="Enter your message here..."
          rows="5"
        />
        <button
          type="submit"
          className="bg-teal-500 text-white py-3 px-6 rounded-xl hover:bg-teal-600 transition-colors duration-300 font-semibold"
        >
          Send Alert
        </button>
      </form>

      {/* Sent Alerts Section */}
      <h2 className="text-3xl font-bold mb-6 text-teal-700">Sent Alerts</h2>
      <div className="bg-white shadow-lg rounded-2xl p-6">
        {alerts.length > 0 ? (
          alerts.map(alert => (
            <div
              key={alert._id}
              className="border-b border-gray-200 py-4 last:border-b-0"
            >
              <p className="text-gray-900">
                <strong className="font-semibold">Message:</strong> {alert.message}
              </p>
              <p className="text-gray-600">
                <strong className="font-semibold">Sent By:</strong> {alert.sentBy}
              </p>
              <p className="text-gray-600">
                <strong className="font-semibold">Sent At:</strong>{' '}
                {new Date(alert.sentAt).toLocaleString()}
              </p>
              <p className="text-gray-600">
                <strong className="font-semibold">Status:</strong> {alert.status}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center italic">No alerts sent yet.</p>
        )}
      </div>
    </div>
  );
};

export default AlertManagement;