// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import "./Navbar.css"; // Optional for styling

const Navbar = () => {
  return (
    <nav className="nav-bar">
      <Link to="/customer">Home</Link>
      <Link to="/books">Books</Link>
      <Link to="/bestsellers">Bestsellers</Link>
      <Link to="/reviews">Reviews</Link>
      <Link to="/cart">Cart</Link>
    </nav>
  );
};

export default Navbar;
