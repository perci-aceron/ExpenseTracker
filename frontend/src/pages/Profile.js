// src/components/Profile.js
import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContexts.js';

const Profile = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <div>Loading...</div>;

  return user ? (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  ) : (
    <div>User not logged in</div>
  );
};

export default Profile;
