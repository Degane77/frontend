import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DoctorForm = () => {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    fullName: '',
    specialty: '',
    workplace: '',
    educationLevel: 'Bachelor',
    phone: '',
    email: '',
    address: '',
    doctorImage: null,
  });
  const [editingId, setEditingId] = useState(null); // 🔁 Update flag

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(window.location.origin + '/api/doctors');
      setDoctors(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setDoctors([]);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    const token = localStorage.getItem('token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    try {
      if (editingId) {
        await axios.put(window.location.origin + `/api/doctors/${editingId}`, data, config);
      } else {
        await axios.post(window.location.origin + '/api/doctors', data, config);
      }
      setForm({
        fullName: '',
        specialty: '',
        workplace: '',
        educationLevel: 'Bachelor',
        phone: '',
        email: '',
        address: '',
        doctorImage: null,
      });
      setEditingId(null);
      fetchDoctors();
    } catch (err) {
      console.error('Error creating/updating doctor:', err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    try {
      await axios.delete(window.location.origin + `/api/doctors/${id}`, config);
      fetchDoctors();
    } catch (err) {
      console.error('Error deleting doctor:', err);
    }
  };

  const handleEdit = (doctor) => {
    setForm({
      fullName: doctor.fullName,
      specialty: doctor.specialty,
      workplace: doctor.workplace,
      educationLevel: doctor.educationLevel || 'Bachelor',
      phone: doctor.phone,
      email: doctor.email,
      address: doctor.address,
      doctorImage: null,
    });
    setEditingId(doctor._id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col">
      <div className="max-w-5xl mx-auto px-6 py-10 w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 drop-shadow-lg">
            {editingId ? 'Update Doctor' : 'Add a Doctor'}
          </h1>
          <Link to="/admindashboard">
            <button className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform duration-200">
              Go to Dashboard
            </button>
          </Link>
        </div>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/80 p-8 rounded-2xl shadow-2xl border border-purple-200"
        >
          <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required className="input bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-purple-400" />
          <input name="specialty" placeholder="Specialty" value={form.specialty} onChange={handleChange} required className="input bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-purple-200 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-400" />
          <input name="workplace" placeholder="Workplace" value={form.workplace} onChange={handleChange} className="input bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-pink-200 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-pink-400" />
          <select name="educationLevel" value={form.educationLevel} onChange={handleChange} className="input bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-green-200 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-green-400">
            <option>Bachelor</option>
            <option>Master</option>
            <option>PhD</option>
          </select>
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="input bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-400" />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="input bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-purple-200 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-purple-400" />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="input bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-pink-200 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-pink-400" />
          <input type="file" name="doctorImage" accept="image/*" onChange={handleChange} className="file-input bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-300 rounded-lg px-4 py-3 text-gray-800" />
          <div className="md:col-span-2 text-center mt-4">
            <button type="submit" className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform duration-200">
              {editingId ? 'Update Doctor' : 'Add Doctor'}
            </button>
          </div>
        </form>
        <h2 className="text-3xl font-bold mt-12 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 drop-shadow-lg">Doctor List</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {doctors.map((doc) => (
            <div key={doc._id} className="bg-white/90 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition border-2 border-purple-100">
              {doc.doctorImage && (
                <img
                  src={`/uploads/doctors/${doc.doctorImage.filename}`}
                  alt={doc.fullName}
                  className="w-full h-48 object-cover border-b-2 border-purple-200"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-700 mb-2">{doc.fullName}</h3>
                <p className="text-blue-600 font-semibold mb-1">{doc.specialty}</p>
                <p className="text-sm text-gray-500 mb-1">{doc.email}</p>
                <p className="text-sm text-gray-500 mb-1">📞 {doc.phone}</p>
                <div className="mt-4 flex justify-between text-sm">
                  <button onClick={() => handleEdit(doc)} className="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-4 py-1 rounded-lg shadow hover:scale-105 transition-transform">Edit</button>
                  <button onClick={() => handleDelete(doc._id)} className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-1 rounded-lg shadow hover:scale-105 transition-transform">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorForm;
