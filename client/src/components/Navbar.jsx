import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.isAdmin;

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-800">AIWave</Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Beranda
            </Link>
            <Link to="/ai-news" className="text-gray-600 hover:text-blue-600 transition-colors">
              Berita AI
            </Link>
            
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <span className="mr-2">{user?.name || 'Profil'}</span>
                  <div className="bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Masuk
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;