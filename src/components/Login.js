import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log('Login response:', data); // Debug log
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role); // Role from backend
        if (data.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (data.role === 'canteenAdmin') {
          navigate('/canteen-admin-dashboard');
        } else {
          navigate('/employee-dashboard');
        }
      } else {
        setError(data.msg || 'Login failed');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-white bg-gradient-to-r from-[#00A3E0] to-[#007BFF] py-3 px-4 rounded-xl">
          Login
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
            <input
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Password</label>
            <input
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300"
            type="submit"
          >
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center">
          <a href="/signup" className="text-teal-500 hover:text-teal-600 font-medium">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;