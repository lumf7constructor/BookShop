import React from 'react';
import { Link } from 'react-router-dom';

const ManagerPage = () => {
  return (
    <div className="manager-page">
      <h1>Hello, Manager</h1>
      <nav className="nav-bar">
        <Link to="/">Home</Link>
        <Link to="/customer">Customer Page</Link>
      </nav>
    </div>
  );
};

export default ManagerPage;
