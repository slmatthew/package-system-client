import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Привет, {user?.first_name || 'User'}</h1>
      <p>Here’s an overview of your activities.</p>
    </div>
  );
};

export default Dashboard;
