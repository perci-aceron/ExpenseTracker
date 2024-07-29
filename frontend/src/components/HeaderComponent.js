import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './LogoComponent'; // Create a Logo component or use an image directly

const Header = () => {
  return (
    <header>
      <Link to="/">
        <Logo />
      </Link>
      {/* Add navigation for other public routes if needed */}
    </header>
  );
};

export default Header;
