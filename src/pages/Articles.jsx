import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaUserCircle,
  FaNewspaper,
} from 'react-icons/fa';
import { fetchArticles } from '../services/articleService';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const res = await fetchArticles();
        setArticles(res.data);
      } catch (err) {
        console.error('Error loading articles:', err);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const formatDateParts = (dateStr) => {
    const date = new Date(dateStr);
    return {
      day: String(date.getDate()).padStart(2, '0'),
      month: date.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    };
  };

  const getReadTime = (text) => {
    const words = text.split(' ').length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 text-gray-600 text-xl">
        Loading Articles...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-800 to-indigo-800 text-white py-10 mb-12 shadow-lg">
        <div className="max-w-6xl mx-auto px-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-yellow-300 hover:text-yellow-100 mb-4 text-sm transition"
          >
            <FaArrowLeft /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-1">
            <FaNewspaper className="text-3xl" />
            <h1 className="text-4xl font-bold tracking-wide font-serif">
              Mental Health Journal
            </h1>
          </div>
          <p className="text-lg opacity-90">
            Explore real stories, expert advice & AI-powered mental wellness insights
          </p>
        </div>
      </div>

      {/* Articles List */}
      <div className="max-w-6xl mx-auto px-6 space-y-14 pb-24">
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <FaNewspaper className="text-6xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Articles Yet</h2>
            <p className="text-gray-500">New stories coming soon. Stay tuned!</p>
          </div>
        ) : (
          articles.map((article, index) => {
            const { day, month } = formatDateParts(article.createdAt);
            const firstSentence = article.description.split('.')[0] + '.';
            const restText = article.description.slice(firstSentence.length);

            return (
              <div
                key={article._id}
                className="relative flex flex-col md:flex-row bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                {/* Date */}
                <div className="flex flex-col items-center justify-center bg-gray-100 w-full md:w-24 py-4 text-center">
                  <span className="text-xs text-gray-500">{month}</span>
                  <span className="text-3xl font-extrabold text-blue-700">{day}</span>
                </div>

                {/* Image */}
                <div className="w-full md:w-72 h-56 md:h-auto overflow-hidden">
                  {article.imageUrl ? (
                    <img
                      src={` https://backend-voz7.onrender.com/uploads${article.imageUrl}`}
                      alt={article.title}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 text-white text-lg">
                      <FaNewspaper className="text-white text-4xl" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                      Mental Health
                    </span>
                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full">
                      Wellness
                    </span>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-blue-800 hover:text-purple-600 transition line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-gray-700 text-sm leading-relaxed">
                    <span className="font-semibold">{firstSentence}</span>
                    {restText}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-sm text-gray-600 font-medium">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt />
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUserCircle />
                      <span>Admin</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 italic">{getReadTime(article.description)}</div>

                  <Link
                    to={`/articles/${article._id}`}
                    className="inline-block text-sm mt-3 text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    View Full Article →
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Animation Keyframe */}
      <style>
        {`
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            opacity: 0;
            animation: fade-in-up 0.6s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default Articles;
