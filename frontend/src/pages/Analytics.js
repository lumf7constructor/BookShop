import React from 'react';
import Navbar2 from '../pages/Navbar2'; // Use your manager navbar
import '../styles/analytics.css'; // Optional: create this if you want custom styles

const Analytics = () => {
  return (
    <div className="analytics-page">
      <Navbar2 />
      <h1>Hi, this page is showing Analytics.</h1>
      <p className="analytics-info">Here you'll be able to view Analytics.</p>
    </div>
  );
};

export default Analytics;
