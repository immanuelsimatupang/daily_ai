import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { articleAPI } from '../services/api';
import UserManagement from '../components/UserManagement';

const AdminPage = () => {
  const { user, users, isAuthenticated, loading, getUsers } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('articles'); // 'articles' atau 'users'

  useEffect(() => {
    // Redirect jika tidak terautentikasi atau bukan admin
    if (!loading && (!isAuthenticated || !user?.isAdmin)) {
      navigate('/');
    } else if (user?.isAdmin) {
      fetchArticles();
      if (activeTab === 'users') {
        fetchUsers();
      }
    }
  }, [isAuthenticated, loading, navigate, user, activeTab]);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const response = await articleAPI.getArticles();
      setArticles(response.data.articles);
      
      // Hitung statistik artikel
      const total = response.data.articles.length;
      const published = response.data.articles.filter(article => article.status === 'published').length;
      const drafts = total - published;
      
      setStats(prevStats => ({
        ...prevStats,
        totalArticles: total,
        publishedArticles: published,
        draftArticles: drafts
      }));
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Gagal memuat artikel. Silakan coba lagi nanti.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      await getUsers();
      
      // Hitung statistik pengguna
      if (users) {
        const total = users.length;
        const active = users.filter(user => user.isActive !== false).length;
        const admins = users.filter(user => user.isAdmin === true).length;
        
        setStats(prevStats => ({
          ...prevStats,
          totalUsers: total,
          activeUsers: active,
          adminUsers: admins
        }));
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Gagal memuat data pengguna. Silakan coba lagi nanti.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      try {
        await articleAPI.deleteArticle(id);
        // Refresh daftar artikel
        fetchArticles();
      } catch (err) {
        console.error('Error deleting article:', err);
        setError('Gagal menghapus artikel. Silakan coba lagi nanti.');
      }
    }
  };

  if (loading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user?.isAdmin) {
    return null; // Akan di-redirect oleh useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <div className="flex space-x-3">
          {activeTab === 'articles' && (
            <Link 
              to="/admin/article/new" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tambah Artikel Baru
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('articles')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'articles' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Artikel
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Pengguna
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'articles' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-2">Total Artikel</h2>
              <p className="text-3xl font-bold text-blue-600">{stats.totalArticles}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-2">Artikel Terpublikasi</h2>
              <p className="text-3xl font-bold text-green-600">{stats.publishedArticles}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-2">Artikel Draft</h2>
              <p className="text-3xl font-bold text-yellow-600">{stats.draftArticles}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-xl font-semibold p-6 border-b">Daftar Artikel</h2>
            
            {articles.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Belum ada artikel. Klik "Tambah Artikel Baru" untuk membuat artikel pertama.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {articles.map((article) => (
                      <tr key={article._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{article.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {article.status === 'published' ? 'Terpublikasi' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(article.createdAt).toLocaleDateString('id-ID', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link 
                              to={`/admin/article/${article._id}`} 
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </Link>
                            <button 
                              onClick={() => handleDeleteArticle(article._id)} 
                              className="text-red-600 hover:text-red-900"
                            >
                              Hapus
                            </button>
                            <Link 
                              to={`/article/${article._id}`} 
                              className="text-gray-600 hover:text-gray-900"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Lihat
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-2">Total Pengguna</h2>
              <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-2">Pengguna Aktif</h2>
              <p className="text-3xl font-bold text-green-600">{stats.activeUsers}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-2">Pengguna Admin</h2>
              <p className="text-3xl font-bold text-purple-600">{stats.adminUsers}</p>
            </div>
          </div>

          <UserManagement />
        </>
      )
    </div>
  );
};

export default AdminPage;