import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
//import Users from './pages/Users';
//import Facilities from './pages/Facilities';
import Packages from './pages/Packages';
import PackageStatusHistory from './pages/PackageStatusHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import RequireAuth from './components/RequireAuth';
import Layout from './components/Layout';
import PackageStatusAdd from './pages/Admin/PackageStatusAdd';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<RequireAuth><Layout /></RequireAuth>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/status-history/:tracking_number" element={<PackageStatusHistory />} />
      </Route>
      <Route element={<RequireAuth allowedRoles={['admin']}><Layout /></RequireAuth>}>
        <Route path="/admin/packages/status/new" element={<PackageStatusAdd />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
