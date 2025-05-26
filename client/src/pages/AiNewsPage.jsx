import React, { useState, useEffect } from 'react';
import axios from 'axios'; // We'll use axios directly here for simplicity
import CuratedNewsCard from '../components/CuratedNewsCard';
import SkeletonCard from '../components/SkeletonCard'; // Import SkeletonCard
// Assuming api.js is set up for VITE_API_URL, but for simplicity, we can construct URL here
// Or import a generic api instance if preferred and setup.
// For now, direct construction:
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


const AiNewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeCategory, setActiveCategory] = useState(''); // '' for all
  const [sortBy, setSortBy] = useState('publishedAt_desc'); // Added state for sorting
  const [refreshKey, setRefreshKey] = useState(0); // Added state for refresh trigger

  const categories = [
    { id: '', name: 'All Categories' },
    { id: 'New AI Tools/Products', name: 'New AI Tools/Products' },
    { id: 'AI Model Updates', name: 'AI Model Updates' },
    { id: 'AI Companies', name: 'AI Companies' },
    { id: 'AI Research', name: 'AI Research' },
    { id: 'AI Ethics & Governance', name: 'AI Ethics & Governance' },
    { id: 'AI Applications', name: 'AI Applications' }
  ];

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `${API_BASE_URL}/curated-news?page=${currentPage}&limit=9&sortBy=${sortBy}`; // Added sortBy to URL
        if (activeCategory) {
          url += `&category=${encodeURIComponent(activeCategory)}`;
        }
        const response = await axios.get(url);
        setArticles(response.data.data);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } catch (err) {
        console.error('Error fetching curated news:', err);
        setError(err.response?.data?.message || 'Gagal memuat berita AI terkurasi. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage, activeCategory, sortBy, refreshKey]); // Added refreshKey to dependency array

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRefresh = () => {
    setLoading(true); // Optionally set loading true immediately for better UX
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Berita AI Terkurasi</h1>
        <p className="text-gray-600">Jelajahi berita dan update terbaru seputar Kecerdasan Buatan.</p>
      </div>

      {/* Filter Kategori */}
      <div className="mb-8 overflow-x-auto text-center">
        <div className="inline-flex space-x-2 pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By Dropdown */}
      <div className="mb-6 text-center sm:text-left">
        <label htmlFor="sortOrder" className="mr-2 font-medium text-gray-700">Sort by:</label>
        <select
          id="sortOrder"
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setCurrentPage(1); // Reset to first page on sort change
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="publishedAt_desc">Newest First</option>
          <option value="publishedAt_asc">Oldest First</option>
          <option value="sourceName_asc">Source A-Z</option>
          <option value="sourceName_desc">Source Z-A</option>
          <option value="title_asc">Title A-Z</option>
          <option value="title_desc">Title Z-A</option>
        </select>
        <button
          onClick={handleRefresh}
          className="ml-0 sm:ml-4 mt-4 sm:mt-0 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300"
          disabled={loading} // Disable while loading
        >
          {loading && refreshKey > 0 ? 'Refreshing...' : 'Refresh News'} 
        </button>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, index) => ( // Assuming limit is 9
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">{error}</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600">Belum ada berita AI tersedia</h3>
          <p className="text-gray-500 mt-2">Silakan coba kategori lain atau kembali lagi nanti.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <CuratedNewsCard key={article._id || article.originalUrl} article={article} />
            ))}
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center space-x-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Sebelumnya
              </button>
              <span className="text-gray-700">
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Berikutnya
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AiNewsPage;
