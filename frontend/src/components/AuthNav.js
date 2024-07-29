import React from 'react';
import { Link } from 'react-router-dom';

const AuthNav = () => {
  return (
    <nav>
      <Link to="/register">Sign Up</Link>
      <Link to="/login">Sign In</Link>
    </nav>
  );
};

export default AuthNav;
