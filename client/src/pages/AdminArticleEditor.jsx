import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { articleAPI } from '../services/api';

const AdminArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const isNewArticle = id === 'new';
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    imageUrl: '',
    isPublished: false
  });
  const [isLoading, setIsLoading] = useState(!isNewArticle);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Redirect jika tidak terautentikasi atau bukan admin
    if (!loading && (!isAuthenticated || !user?.isAdmin)) {
      navigate('/');
      return;
    }

    // Jika mode edit, ambil data artikel
    if (!isNewArticle && user?.isAdmin) {
      fetchArticle();
    }
  }, [id, isAuthenticated, loading, navigate, user, isNewArticle]);

  const fetchArticle = async () => {
    try {
      const response = await articleAPI.getArticleById(id);
      setFormData({
        title: response.data.article.title || '',
        content: response.data.article.content || '',
        summary: response.data.article.summary || '',
        imageUrl: response.data.article.imageUrl || '',
        isPublished: response.data.article.isPublished || false
      });
    } catch (err) {
      console.error('Error fetching article:', err);
      setError('Artikel tidak ditemukan atau terjadi kesalahan saat memuat data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage('');

    try {
      if (isNewArticle) {
        await articleAPI.createArticle(formData);
        setSuccessMessage('Artikel berhasil dibuat!');
        // Reset form setelah berhasil membuat artikel baru
        setFormData({
          title: '',
          content: '',
          summary: '',
          imageUrl: '',
          isPublished: false
        });
      } else {
        await articleAPI.updateArticle(id, formData);
        setSuccessMessage('Artikel berhasil diperbarui!');
      }
    } catch (err) {
      console.error('Error saving article:', err);
      setError('Gagal menyimpan artikel. Silakan coba lagi nanti.');
    } finally {
      setIsSaving(false);
      
      // Scroll ke atas untuk menampilkan pesan sukses/error
      window.scrollTo(0, 0);
    }
  };

  const handlePublish = () => {
    setFormData(prev => ({
      ...prev,
      isPublished: !prev.isPublished
    }));
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isNewArticle ? 'Tambah Artikel Baru' : 'Edit Artikel'}
        </h1>
        <Link 
          to="/admin" 
          className="text-blue-600 hover:text-blue-800"
        >
          &larr; Kembali ke Dashboard
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            Judul Artikel
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan judul artikel"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="summary" className="block text-gray-700 font-medium mb-2">
            Ringkasan
          </label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan ringkasan artikel"
            rows="3"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="imageUrl" className="block text-gray-700 font-medium mb-2">
            URL Gambar
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
          />
          {formData.imageUrl && (
            <div className="mt-2">
              <img 
                src={formData.imageUrl} 
                alt="Preview" 
                className="h-40 object-cover rounded-lg" 
                onError={(e) => e.target.src = 'https://via.placeholder.com/640x360?text=Gambar+Tidak+Tersedia'}
              />
            </div>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
            Konten Artikel
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tulis konten artikel di sini..."
            rows="12"
            required
          ></textarea>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <span className="mr-4 text-gray-700">Status:</span>
            <button
              type="button"
              onClick={handlePublish}
              className={`px-4 py-2 rounded-lg ${formData.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
            >
              {formData.isPublished ? 'Terpublikasi' : 'Draft'}
            </button>
          </div>

          <div className="flex gap-4">
            <Link 
              to="/admin" 
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Batal
            </Link>
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Artikel'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminArticleEditor;