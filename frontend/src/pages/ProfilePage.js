// src/components/Profile.js
import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContexts.js';

const Profile = () => {
  const { user, loading, error } = useContext(UserContext);

  if (loading) return <div>Loading...</div>;

  if (error) return <p>{error}</p>;

  if (!user) return <p>No user data available</p>;


  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <img src={user.avatarURL} alt="User Avatar" />
      <p>Email: {user.email}</p>
      <p>Currency: {user.currency}</p>
      <p>Categories: {user.categories}</p>
      <p>Transactions Total: {user.transactionsTotal}</p>
    </div>
  );
};


export default Profile;
