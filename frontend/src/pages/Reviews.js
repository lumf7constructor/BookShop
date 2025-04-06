import React from 'react';
import Navbar2 from '../pages/Navbar2'; // Use your manager navbar
import '../styles/reviews2.css'; // Optional: create this if you want custom styles

const Reviews2 = () => {
  return (
    <div className="reviews2-page">
      <Navbar2 />
      <h1>Hi, this page is showing Reviews.</h1>
      <p className="reviews2-info">Here you'll be able to manage and view your reviews.</p>
    </div>
  );
};

export default Reviews2;
