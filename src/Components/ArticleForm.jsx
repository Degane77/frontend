import { useState, useEffect } from 'react';
import { createArticle, updateArticle, fetchArticleById } from '../services/articleService';

const ArticleForm = ({ editingId, onSuccess }) => {
  const [form, setForm] = useState({ title: '', description: '', image: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingId) {
      setLoading(true);
      setError('');
      fetchArticleById(editingId)
        .then(res => {
          setForm({ 
            title: res.data.title, 
            description: res.data.description, 
            image: null 
          });
        })
        .catch((err) => {
          console.error('Error fetching article:', err);
          setError('Failed to load article data');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [editingId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm(prev => ({ ...prev, image: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('description', form.description.trim());
      if (form.image) formData.append('articleImage', form.image);

      if (editingId) {
        await updateArticle(editingId, formData);
      } else {
        await createArticle(formData);
      }

      setForm({ title: '', description: '', image: null });
      onSuccess();
    } catch (error) {
      console.error('Error saving article:', error);
      setError(error.response?.data?.message || 'Error saving article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        {editingId ? 'Edit Article' : 'Create New Article'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter article title"
            required
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter article description"
            required
            rows="4"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: JPG, PNG, GIF, WebP (Max 50MB)
          </p>
        </div>
        
        <div className="flex gap-3 pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            {loading ? 'Saving...' : (editingId ? 'Update Article' : 'Create Article')}
          </button>
          
          {editingId && (
            <button 
              type="button"
              onClick={() => onSuccess()}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;
