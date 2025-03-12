import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../pictures/bookstore-logo.png'; 
import './Header.css'; 


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
