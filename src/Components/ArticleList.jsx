import { useEffect, useState } from 'react';
import {
  fetchArticles,
  deleteArticle,
} from '../services/articleService';

const ArticleList = ({ onEdit }) => {
  const [articles, setArticles] = useState([]);

  const loadArticles = () => {
    fetchArticles().then(res => setArticles(res.data));
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      await deleteArticle(id);
      loadArticles();
    }
  };

  const handleEdit = (id) => {
    if (onEdit) {
      onEdit(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Articles List</h2>
        <div className="text-sm text-gray-300">
          Total: {articles.length} articles
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <div key={article._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 overflow-hidden">
              {article.imageUrl ? (
                <img
                  src={`http://localhost:5000${article.imageUrl}`}
                  alt={article.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="hidden h-full w-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center"
                style={{ display: article.imageUrl ? 'none' : 'flex' }}
              >
                <span className="text-white text-sm">No Image</span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {article.description}
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(article._id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(article._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {articles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Articles Yet</h3>
          <p className="text-gray-400">Create your first article to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ArticleList;
