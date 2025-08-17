import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const Signup = () => {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users/register', form);
      setMessage(res.data.msg);
      if (res.data.msg === 'User registered successfully') {
        setTimeout(() => navigate('/login'), 1000);
      }
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-blue-700">Create Account</h2>
        {message && (
          <p className={`text-center font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        {/* Full Name */}
        <div className="flex items-center border rounded-lg overflow-hidden">
          <span className="bg-blue-600 p-3 text-white">
            <FaUser />
          </span>
          <input
            name="fullName"
            placeholder="Full Name"
            className="w-full px-3 py-2 outline-none"
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="flex items-center border rounded-lg overflow-hidden">
          <span className="bg-blue-600 p-3 text-white">
            <FaEnvelope />
          </span>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-3 py-2 outline-none"
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="flex items-center border rounded-lg overflow-hidden">
          <span className="bg-blue-600 p-3 text-white">
            <FaLock />
          </span>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-3 py-2 outline-none"
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
          Sign Up
        </button>

        {/* Already have account */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
