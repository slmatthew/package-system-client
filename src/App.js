import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Только Routes и Route
import Login from './pages/Login';
import Packages from './pages/Packages';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/packages"
        element={
          <RequireAuth>
            <Packages />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;
