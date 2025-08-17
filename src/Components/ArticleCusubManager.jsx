import { useEffect, useState } from 'react';

const ArticleCusubManager = () => {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch {
      setMsg('Failed to load Articles');
    } finally {
      setLoading(false);
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = e => setImageFile(e.target.files[0]);

  const parseSafeJson = async res => {
    try {
      const text = await res.text();
      return text ? JSON.parse(text) : {};
    } catch {
      return {};
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');

    if (!form.title.trim()) {
      setMsg('Title is required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    if (imageFile) formData.append('articleImage', imageFile);

    const url = editId ? `/api/articles/${editId}` : '/api/articles';
    const method = editId ? 'PUT' : 'POST';

    setLoading(true);
    try {
      const res = await fetch(url, {
        method,
        body: formData,
        headers: getAuthHeaders()
      });
      const data = await parseSafeJson(res);
      if (!res.ok) throw new Error(data.message || 'Failed to save');

      setMsg(editId ? 'Article updated!' : 'Article created!');
      setForm({ title: '', description: '' });
      setImageFile(null);
      setEditId(null);
      fetchArticles();
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = article => {
    setEditId(article._id);
    setForm({ title: article.title, description: article.description || '' });
    setImageFile(null);
    setMsg('');
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this article?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/articles/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await parseSafeJson(res);
      if (!res.ok) throw new Error(data.message || 'Failed to delete');
      setMsg('Deleted!');
      fetchArticles();
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ title: '', description: '' });
    setImageFile(null);
    setMsg('');
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6">Article Manager</h2>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6 mb-8 space-y-4" encType="multipart/form-data">
        <input name="title" type="text" placeholder="Title" value={form.title} onChange={handleChange} className="w-full border p-2 rounded" required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="articleImage" type="file" accept="image/*" onChange={handleFileChange} className="w-full" />

        <div className="flex gap-2">
          {editId && (
            <button type="button" onClick={handleCancel} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          )}
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
            {editId ? 'Update' : 'Create'}
          </button>
        </div>
        {msg && <div className="text-center text-sm text-red-600">{msg}</div>}
      </form>

      <h3 className="text-xl font-semibold mb-4">All Articles</h3>
      {loading && <div>Loading...</div>}
      <div className="space-y-4">
        {articles.map(article => (
          <div key={article._id} className="bg-gray-50 rounded shadow p-4 flex flex-col md:flex-row md:items-center gap-4">
            {article.image?.filename && (
              <img
                src={`/uploads/articles/${article.image.filename}`}
                alt="article"
                className="w-32 h-24 object-cover rounded border"
              />
            )}
            <div className="flex-1">
              <div className="font-bold text-lg">{article.title}</div>
              <div className="text-gray-600 mb-2">{article.description}</div>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => handleEdit(article)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(article._id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
        {!loading && articles.length === 0 && (
          <div className="text-center text-gray-500">No Articles found.</div>
        )}
      </div>
    </div>
  );
};

export default ArticleCusubManager;
