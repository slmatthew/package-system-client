import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../helpers/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Хранение информации о пользователе
  const [pkgTypes, setPkgTypes] = useState([]);
  const [pkgStatuses, setPkgStatuses] = useState([]);
  const [loading, setLoading] = useState(true); // Для показа загрузки
  const navigate = useNavigate();

  const loadTypesAndStatuses = async () => {
    try {
      const types = await api.get('/package-types');
      setPkgTypes(types.data);

      const statuses = await api.get('/package-statuses');
      setPkgStatuses(statuses.data);
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Проверяем токен при загрузке
    const checkAuth = async () => {
      const token = localStorage.getItem('token');  
      if (token) {
        try {
          const response = await api.get('/users/me');
          setUser(response.data);

          await loadTypesAndStatuses();
        } catch (error) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post('/users/login', credentials);
      localStorage.setItem('token', response.data.token);

      const userResponse = await api.get('/users/me');
      setUser(userResponse.data);

      await loadTypesAndStatuses();
    } catch(err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, pkgStatuses, pkgTypes }}>
      {children}
    </AuthContext.Provider>
  );
}

// Хук для использования AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
