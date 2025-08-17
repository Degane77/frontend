import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaNewspaper,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaArrowLeft,
  FaSignOutAlt
} from 'react-icons/fa';
import ArticleForm from './ArticleForm';
import ArticleList from './ArticleList';
import logo from '../assets/cafye-logo.png';

const ArticleManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020024] to-[#043860] text-white">
      {/* Header */}
      <div className="bg-[#010a2b] p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admindashboard" className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition">
              <FaArrowLeft /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Cafiye Logo" className="w-10 h-10" />
              <h1 className="text-2xl font-bold text-green-400">Article Manager</h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaNewspaper className="text-2xl text-green-400" />
            <h2 className="text-xl font-semibold">Manage Articles</h2>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            <FaPlus /> {showForm ? 'Hide Form' : 'Add New Article'}
          </button>
        </div>

        {/* Article Form */}
        {showForm && (
          <div className="mb-8">
            <ArticleForm 
              editingId={editingId} 
              onSuccess={handleFormSuccess} 
            />
          </div>
        )}

        {/* Article List */}
        <div className="bg-[#010a2b] rounded-xl shadow-lg p-6">
          <ArticleList onEdit={handleEdit} />
        </div>
      </div>
    </div>
  );
};

export default ArticleManager;
