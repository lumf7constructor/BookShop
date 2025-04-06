import React from 'react';
import Navbar2 from '../pages/Navbar2'; // Use your manager navbar
import '../styles/manager.css'; // Optional: create this if you want custom styles

const ManagerPage = () => {
  return (
    <div className="manager-page">
      <Navbar2 />
      <h1>Hi, this page is showing Manager Home Page.</h1>
      <p className="manager-info">Here you'll be able to manage.</p>
    </div>
  );
};

export default ManagerPage;
