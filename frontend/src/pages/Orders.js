import React from 'react';
import Navbar2 from '../pages/Navbar2'; // Use your manager navbar
import '../styles/orders.css'; // Optional: create this if you want custom styles

const Orders = () => {
  return (
    <div className="orders-page">
      <Navbar2 />
      <h1>Hi, this page is showing Orders.</h1>
      <p className="orders-info">Here you'll be able to manage and view your current orders.</p>
    </div>
  );
};

export default Orders;
