import React from "react";
import { Link } from "react-router-dom";
import "../pages/navbar2.css";

const Navbar2 = () => {
  return (
    <div className="nav-bar-2">
      <Link to="/analytics">Analytics</Link>
      <Link to="/stocks">Stock</Link>
      <Link to="/orders">Orders</Link>
      <Link to="/reviews2">Reviews</Link>
      <Link to="/discounts">Discounts</Link>
    </div>
  );
};

export default Navbar2;
