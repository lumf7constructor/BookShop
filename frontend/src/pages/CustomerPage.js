import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/customer.css"; // Optional for additional styling

const CustomerPage = () => {
  return (
    <div className="customer-page">
      <div className="overlay"></div> {/* Overlay for readability */}
      <h1>Hello, Customer</h1>
      <p className="customer-welcome">Discover your next favorite book today!</p>

      <div className="buttons-container">
        <Link to="/books" className="button-link">
          <button className="button books-btn">Explore Books</button>
        </Link>
        <Link to="/bestsellers" className="button-link">
          <button className="button bestsellers-btn">View Bestsellers</button>
        </Link>
      </div>

      {/* Keeping the navbar in its original position (top right) */}
      <nav className="nav-bar">
        <Link to="/">Home</Link>
        <Link to="/books">Books</Link>
        <Link to="/bestsellers">Bestsellers</Link>
        <Link to="/reviews">Reviews</Link>
        <Link to="/cart">Cart</Link>
      </nav>
    </div>
  );
};

export default CustomerPage;
