import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '1rem', background: '#f0f0f0', marginBottom: '1rem' }}>
      <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem', margin: 0 }}>
        <li>
          <Link to="/">Главная</Link>
        </li>
        {user?.role === 'admin' && (
          <>
            <li>
              <Link to="/users">Пользователи</Link>
            </li>
            <li>
              <Link to="/facilities">Склады</Link>
            </li>
          </>
        )}
        {(user?.role === 'admin' || user?.role === 'sorter') && (
          <li>
            <Link to="/status-history">Логистика</Link>
          </li>
        )}
        <li>
          <Link to="/packages">Мои посылки</Link>
        </li>
        <li>
          <button onClick={handleLogout} style={{ cursor: 'pointer' }}>
            Выйти
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
