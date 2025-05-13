import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AlertList = () => {
  const [alerts, setAlerts] = useState([]);
  const [token] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!token || role !== 'employee') navigate('/login');
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [token, navigate, role]);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/alerts/employee', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Sort by sentAt in descending order (latest first)
      const sortedAlerts = response.data.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
      setAlerts(sortedAlerts);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  };

  return (
    <div className="p-4">
      <div className="bg-white shadow-lg rounded-lg p-4">
        {alerts.length > 0 ? (
          alerts.map(alert => (
            <div key={alert._id} className="border-b py-2">
              <p><strong>Message:</strong> {alert.message}</p>
              <p><strong>Sent By:</strong> {alert.sentBy}</p>
              <p><strong>Sent At:</strong> {new Date(alert.sentAt).toLocaleString()}</p>
              <p><strong>Status:</strong> {alert.status}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No alerts received yet.</p>
        )}
      </div>
    </div>
  );
};

export default AlertList;
