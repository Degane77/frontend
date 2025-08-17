import { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    description: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Message sent successfully ✅');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          description: '',
        });
      } else {
        setMessage(data.error || 'Failed to send message ❌');
      }
    } catch (err) {
      setMessage('Server error ❌');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Contact Us</h2>
      {message && <div className="mb-4 text-center text-sm text-blue-600">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
      {message && <div className="mt-4 text-center text-sm text-blue-600">{message}</div>}
    </div>
  );
};

export default ContactForm;