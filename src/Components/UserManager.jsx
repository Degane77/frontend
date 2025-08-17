import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserSendMessage from './UserSendMessage';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ fullName: '', email: '', role: 'user', password: '' });
  const [msg, setMsg] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [showSendMsgId, setShowSendMsgId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setMsg('Error loading users');
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleEdit = user => {
    setEditId(user._id);
    setForm({ fullName: user.fullName, email: user.email, role: user.role, password: '' });
    setMsg('');
    setShowAdd(false);
  };

  const handleDelete = async id => {
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async e => {
    e.preventDefault();
    await fetch(`/api/users/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setEditId(null);
    setForm({ fullName: '', email: '', role: 'user', password: '' });
    fetchUsers();
    setMsg('✅ User updated');
  };

  const handleAddUser = async e => {
    e.preventDefault();
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setMsg(data.msg || '✅ User registered');
    setForm({ fullName: '', email: '', role: 'user', password: '' });
    setShowAdd(false);
    fetchUsers();
  };

  // Filter users by search
  const filteredUsers = users.filter(u =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">👥 User Manager</h2>
        <Link to="/admindashboard">
          <button className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded shadow transition">
            🔙 Dashboard
          </button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex justify-end">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email or role"
          className="border p-2 rounded w-full sm:w-64"
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg shadow mb-6">
        <p className="font-semibold text-gray-700 mb-2">Total Users: {filteredUsers.length}</p>
        <div className="flex flex-wrap gap-2">
          {filteredUsers.slice(0, 5).map(u => (
            <span key={u._id} className="bg-blue-200 text-blue-900 px-3 py-1 rounded-full text-sm">{u.fullName}</span>
          ))}
          {filteredUsers.length > 5 && <span className="text-gray-500 text-sm">+ more</span>}
        </div>
      </div>

      <button
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mb-6 transition"
        onClick={() => {
          setShowAdd(!showAdd);
          setEditId(null);
          setForm({ fullName: '', email: '', role: 'user', password: '' });
          setMsg('');
        }}
      >
        {showAdd ? 'Cancel' : '➕ Register New User'}
      </button>

      {showAdd && (
        <form onSubmit={handleAddUser} className="grid md:grid-cols-2 gap-4 bg-white p-6 rounded shadow mb-8">
          <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} className="input" required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="input" required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="input" required />
          <select name="role" value={form.role} onChange={handleChange} className="input">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">✅ Register</button>
        </form>
      )}

      {editId && (
        <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-4 bg-white p-6 rounded shadow mb-8">
          <h3 className="md:col-span-2 text-xl font-semibold text-gray-800">✏️ Edit User</h3>
          <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} className="input" required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="input" required />
          <input name="password" type="password" placeholder="New Password (optional)" value={form.password} onChange={handleChange} className="input" />
          <select name="role" value={form.role} onChange={handleChange} className="input">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="md:col-span-2 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition">💾 Update</button>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {filteredUsers.map(u => (
          <div key={u._id} className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold uppercase">
                {u.fullName?.slice(0, 1) || '?'}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">{u.fullName}</h4>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2"><strong>Role:</strong> {u.role}</p>
            <div className="flex gap-2 mb-2">
              <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition" onClick={() => handleEdit(u)}>Edit</button>
              <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition" onClick={() => handleDelete(u._id)}>Delete</button>
              <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition" onClick={() => setShowSendMsgId(showSendMsgId === u._id ? null : u._id)}>
                {showSendMsgId === u._id ? 'Close' : 'Send Message'}
              </button>
            </div>
            {showSendMsgId === u._id && (
              <UserSendMessage receiverId={u._id} receiverName={u.fullName || u.email} onSent={() => setShowSendMsgId(null)} />
            )}
          </div>
        ))}
      </div>

      {msg && <div className="mt-6 text-center text-green-600 font-medium">{msg}</div>}
    </div>
  );
};

export default UserManager;