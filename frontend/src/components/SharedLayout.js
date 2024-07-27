// src/components/SharedLayout.js
import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import BgImageWrapper from './BgImageWrapper';
import { UserContext } from '../contexts/UserContexts.js';

const SharedLayout = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <Header />
      {user ? (
        <Outlet /> // Render nested routes if the user is authenticated
      ) : (
        <BgImageWrapper>
          <Outlet />
        </BgImageWrapper>
      )}
    </>
  );
};

export default SharedLayout;

// Render nested routes with background image for non-authenticated users
