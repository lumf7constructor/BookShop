import React from 'react';
import Navbar2 from '../pages/Navbar2'; // Use your manager navbar
import '../styles/discounts.css'; 

const Discounts = () => {
  return (
    <div className="discount-page">
      <Navbar2 />
      <h1>Hi, this page is showing Disocunts.</h1>
      <p className="discount-info">Here you'll be able to manage and view your cdiscount info.</p>
    </div>
  );
};

export default Discounts;
