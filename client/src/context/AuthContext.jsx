import { createContext, useState, useEffect, useContext } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usersLoading, setUsersLoading] = useState(false);
  
  // Fungsi untuk memeriksa apakah pengguna memiliki role admin
  // Catatan: Ini hanya contoh implementasi, pada implementasi sebenarnya
  // role admin harus diperiksa dari respons API

  // Cek apakah user sudah login saat aplikasi dimuat
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await authAPI.getProfile();
          // Tambahkan properti isAdmin ke objek user
          // Pada implementasi sebenarnya, properti ini harus berasal dari respons API
          // Contoh ini hanya untuk demonstrasi
          const userData = {
            ...res.data.user,
            // Cek apakah email pengguna adalah admin@aiwave.com untuk memberikan akses admin
            // Ini hanya contoh sederhana, pada implementasi sebenarnya gunakan data dari server
            isAdmin: res.data.user.email === 'admin@aiwave.com'
          };
          setUser(userData);
        }
      } catch (error) {
        localStorage.removeItem('token');
        console.error('Error saat memverifikasi token:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Fungsi untuk register
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authAPI.register(userData);
      localStorage.setItem('token', res.data.user.token);
      // Tambahkan properti isAdmin ke objek user
      const userData = {
        ...res.data.user,
        isAdmin: res.data.user.email === 'admin@aiwave.com'
      };
      setUser(userData);
      return res.data.user;
    } catch (error) {
      setError(error.response?.data?.message || 'Terjadi kesalahan saat mendaftar');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk login
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authAPI.login(credentials);
      localStorage.setItem('token', res.data.user.token);
      // Tambahkan properti isAdmin ke objek user
      const userData = {
        ...res.data.user,
        isAdmin: res.data.user.email === 'admin@aiwave.com'
      };
      setUser(userData);
      return res.data.user;
    } catch (error) {
      setError(error.response?.data?.message || 'Email atau password salah');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Fungsi untuk mendapatkan semua pengguna (hanya untuk admin)
  const getUsers = async () => {
    if (!user?.isAdmin) return;
    
    setUsersLoading(true);
    setError(null);
    try {
      const res = await userAPI.getUsers();
      setUsers(res.data.users);
      return res.data.users;
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal memuat daftar pengguna');
      throw error;
    } finally {
      setUsersLoading(false);
    }
  };

  // Fungsi untuk mengubah status admin pengguna
  const setAdminRole = async (userId, isAdmin) => {
    if (!user?.isAdmin) return;
    
    setError(null);
    try {
      await userAPI.setAdminRole(userId, isAdmin);
      // Update daftar pengguna setelah perubahan
      getUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal mengubah hak akses pengguna');
      throw error;
    }
  };

  // Fungsi untuk mengubah status aktif pengguna
  const updateUserStatus = async (userId, isActive) => {
    if (!user?.isAdmin) return;
    
    setError(null);
    try {
      await userAPI.updateUserStatus(userId, isActive);
      // Update daftar pengguna setelah perubahan
      getUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal mengubah status pengguna');
      throw error;
    }
  };

  // Fungsi untuk menghapus pengguna
  const deleteUser = async (userId) => {
    if (!user?.isAdmin) return;
    
    setError(null);
    try {
      await userAPI.deleteUser(userId);
      // Update daftar pengguna setelah penghapusan
      getUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal menghapus pengguna');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        loading,
        usersLoading,
        error,
        register,
        login,
        logout,
        getUsers,
        setAdminRole,
        updateUserStatus,
        deleteUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook untuk menggunakan AuthContext
export const useAuth = () => useContext(AuthContext);

export default AuthContext;