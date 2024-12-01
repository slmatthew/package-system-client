import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
//import Facilities from './pages/Facilities';
import Packages from './pages/Packages';
import PackageStatusHistory from './pages/PackageStatusHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import RequireAuth from './components/RequireAuth';
import Layout from './components/Layout';
import PackageStatuses from './pages/Admin/PackageStatuses';
import PackageTypes from './pages/Admin/PackageTypes';
import PackagesManage from './pages/Admin/PackagesManage';
import UserManagementPage from './pages/Admin/UserManagement';
import NewPackage from './pages/NewPackage';
import FacilitiesPage from './pages/Admin/FacilitiesPage';
import EditFacilityPage from './pages/Admin/EditFacilityPage';
import CreateFacilityPage from './pages/Admin/CreateFacilityPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<RequireAuth><Layout /></RequireAuth>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/tracking/:tracking_number" element={<PackageStatusHistory />} />
        <Route path="/packages/new" element={<NewPackage />} />
      </Route>
      <Route element={<RequireAuth allowedRoles={['admin', 'sorter']}><Layout /></RequireAuth>}>
        <Route path="/admin/packages" element={<PackagesManage />} />
        <Route path="/admin/facilities" element={<FacilitiesPage />} />
      </Route>
      <Route element={<RequireAuth allowedRoles={['admin']}><Layout /></RequireAuth>}>
        <Route path="/admin/package-statuses" element={<PackageStatuses />} />
        <Route path="/admin/package-types" element={<PackageTypes />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/facilities/edit/:id" element={<EditFacilityPage />} />
        <Route path="/admin/facilities/new" element={<CreateFacilityPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
