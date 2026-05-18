import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../utils/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on page load
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/me`, {
          withCredentials: true
        });
        setUser(res.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  // Email/Password Login
  const login = async (email, password) => {
    const res = await axios.post(
      `${API_URL}/api/auth/login`,
      { email, password },
      { withCredentials: true }
    );
    setUser(res.data.user);
    return res.data;
  };

  // Email/Password Register
  const register = async (name, email, password, photoURL) => {
    const res = await axios.post(
      `${API_URL}/api/auth/register`,
      { name, email, password, photoURL },
      { withCredentials: true }
    );
    return res.data;
  };

  // Google Login
  const googleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const { displayName, email, photoURL } = result.user;

    const res = await axios.post(
      `${API_URL}/api/auth/google`,
      { name: displayName, email, photoURL },
      { withCredentials: true }
    );
    setUser(res.data.user);
    return res.data;
  };

  // Logout
  const logout = async () => {
    await axios.post(
      `${API_URL}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
    await signOut(auth);
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    googleLogin,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};