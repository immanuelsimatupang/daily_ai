import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const response = await articleAPI.getArticleById(id);
        setArticle(response.data.article);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Artikel tidak ditemukan atau terjadi kesalahan saat memuat artikel.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
        <div className="mt-4">
          <Link to="/" className="text-blue-600 hover:underline">← Kembali ke beranda</Link>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600">Artikel tidak ditemukan</h3>
          <p className="text-gray-500 mt-2">Artikel yang Anda cari mungkin telah dihapus atau tidak tersedia</p>
          <div className="mt-4">
            <Link to="/" className="text-blue-600 hover:underline">← Kembali ke beranda</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-4">
        <Link to="/" className="text-blue-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke beranda
        </Link>
      </div>

      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        <img 
          src={article.image || '/images/default-article.jpg'} 
          alt={article.title}
          className="w-full h-64 md:h-96 object-cover"
        />
        
        <div className="p-6">
          <div className="flex items-center mb-4">
            <span className="text-sm font-semibold px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              {article.category}
            </span>
            <span className="text-sm text-gray-500 ml-3">
              {new Date(article.createdAt).toLocaleDateString('id-ID', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-gray-800">{article.title}</h1>
          
          <div className="flex items-center mb-6">
            <div className="flex items-center">
              <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                <span className="text-gray-700 font-medium">
                  {article.author?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <span className="text-gray-700">
                {article.author?.name || 'Admin'}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500 ml-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {article.viewCount} kali dilihat
            </div>
          </div>
          
          <div className="prose max-w-none">
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
      
      {!isAuthenticated && (
        <div className="mt-8 bg-blue-50 p-6 rounded-lg text-center">
          <h3 className="text-xl font-semibold text-blue-800 mb-2">Ingin akses ke lebih banyak artikel?</h3>
          <p className="text-blue-600 mb-4">Daftar sekarang untuk mendapatkan akses ke semua konten premium kami.</p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Daftar
            </Link>
            <Link to="/login" className="bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors">
              Masuk
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;