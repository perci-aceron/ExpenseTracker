// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContexts.js';

const PrivateRoute = ({ element }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <div>Loading...</div>; // Or a loading spinner

  return user ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
