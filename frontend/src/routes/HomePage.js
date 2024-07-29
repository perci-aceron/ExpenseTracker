import React from 'react';
import BgImageWrapper from '../components/BgImageWrapper';
import Header from '../components/Header';
import AuthNav from '../components/AuthNav';
import AllUsersTab from '../components/AllUsersTab'; // Include this for desktop

const HomePage = () => {
  return (
    <BgImageWrapper>
      <Header />
      <AuthNav />
      {/* Conditionally render AllUsersTab based on screen size if needed */}
      <AllUsersTab />
      {/* Add additional content for the HomePage */}
    </BgImageWrapper>
  );
};

export default HomePage;
