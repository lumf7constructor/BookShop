import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/home.css"; // Import CSS

const Home = () => {
  return (
    <div className="home-container">
      <div className="left-side">
        <Link to="/manager" className="link">
          <div className="content">
            <h2 className="section-title">Continue as Manager</h2>
          </div>
        </Link>
      </div>
      <div className="right-side">
        <Link to="/customer" className="link">
          <div className="content">
            <h2 className="section-title">Continue as Customer</h2>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
