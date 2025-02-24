import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../pictures/bookstore-logo.png'; // Update the path to your logo image
import './Header.css'; // Ensure this is correctly linking the CSS


const Header = () => {
  return (
    <header className="header-container">
      <Link to="/" className="logo-link">
        <img src={logo} alt="BookShop Logo" className="logo" />
      </Link>
    </header>
  );
};

export default Header;
