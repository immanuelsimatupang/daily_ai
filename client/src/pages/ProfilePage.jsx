import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Redirect ke halaman login jika tidak terautentikasi
    if (!loading && !isAuthenticated) {
      navigate('/login');
    } else if (user) {
      setProfileData(user);
    }
  }, [isAuthenticated, loading, navigate, user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !profileData) {
    return null; // Akan di-redirect oleh useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 h-32"></div>
        
        <div className="px-6 py-4 relative">
          <div className="absolute -top-16 left-6">
            <div className="bg-gray-200 rounded-full h-32 w-32 border-4 border-white flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-700">
                {profileData.name?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
          
          <div className="mt-20">
            <h1 className="text-2xl font-bold text-gray-800">{profileData.name}</h1>
            <p className="text-gray-600">{profileData.email}</p>
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Informasi Profil</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Nama Lengkap</h3>
                <p className="text-gray-800 mt-1">{profileData.name}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="text-gray-800 mt-1">{profileData.email}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Tanggal Bergabung</h3>
                <p className="text-gray-800 mt-1">
                  {profileData.createdAt 
                    ? new Date(profileData.createdAt).toLocaleDateString('id-ID', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })
                    : 'Tidak tersedia'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Keluar
            </button>
            
            <Link 
              to="/"
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 text-center"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Aktivitas Terbaru</h2>
        
        <div className="text-center py-8 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>Belum ada aktivitas terbaru</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;