import { useState, useEffect } from 'react';
import { articleAPI } from '../services/api';
import ArticleCard from '../components/ArticleCard';

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('semua');
  
  const categories = [
    { id: 'semua', name: 'Semua' },
    { id: 'teknologi', name: 'Teknologi' },
    { id: 'kesehatan', name: 'Kesehatan' },
    { id: 'pendidikan', name: 'Pendidikan' },
    { id: 'bisnis', name: 'Bisnis' },
    { id: 'hiburan', name: 'Hiburan' },
    { id: 'lainnya', name: 'Lainnya' }
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeCategory !== 'semua') {
          params.category = activeCategory;
        }
        
        const response = await articleAPI.getArticles(params);
        setArticles(response.data.articles);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Gagal memuat artikel. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [activeCategory]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">AIWave</h1>
        <p className="text-gray-600">Platform konten AI untuk kebutuhan harian Anda</p>
      </div>
      
      {/* Filter Kategori */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tampilkan Loading, Error, atau Artikel */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600">Belum ada artikel tersedia</h3>
          <p className="text-gray-500 mt-2">Silakan coba kategori lain atau kembali lagi nanti</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;