import React from 'react';
import { Link } from 'react-router-dom';  
import Navbar from './Navbar'; // Importing the Navbar component
import "../styles/customer.css"; 

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
    </div>
  );
};

export default CustomerPage;
