import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar2 from '../pages/Navbar2'; // Use your manager navbar
import '../styles/discounts.css'; // Optional: create this for custom styles

const Discounts = () => {
  const [discountCode, setDiscountCode] = useState('');
  const [validityStartDate, setValidityStartDate] = useState('');
  const [validityEndDate, setValidityEndDate] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [discounts, setDiscounts] = useState([]);
  
  // Fetch existing discounts on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/discounts')
      .then(response => {
        setDiscounts(response.data);
      })
      .catch(error => {
        console.error('Error fetching discounts:', error);
      });
  }, []);

  // Handle adding a new discount
  const handleAddDiscount = (e) => {
    e.preventDefault();
    const newDiscount = {
      discount_code: discountCode,
      validity_start_date: validityStartDate,
      validity_end_date: validityEndDate,
      discount_percentage: discountPercentage
    };

    axios.post('http://localhost:5000/api/discounts', newDiscount)
      .then((response) => {
        setDiscounts([...discounts, response.data]);
        setDiscountCode('');
        setValidityStartDate('');
        setValidityEndDate('');
        setDiscountPercentage('');
      })
      .catch((error) => {
        console.error('Error adding discount:', error);
      });
  };

  return (
    <div className="discount-page">
      <Navbar2 />
      <h1>📦 Discounts Management</h1>

      <div className="add-discount-form">
        <h2>Add Discount Code</h2>
        <form onSubmit={handleAddDiscount}>
          <div className="form-group">
            <label htmlFor="discountCode">Discount Code:</label>
            <input
              type="text"
              id="discountCode"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="validityStartDate">Start Date:</label>
            <input
              type="date"
              id="validityStartDate"
              value={validityStartDate}
              onChange={(e) => setValidityStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="validityEndDate">End Date:</label>
            <input
              type="date"
              id="validityEndDate"
              value={validityEndDate}
              onChange={(e) => setValidityEndDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="discountPercentage">Discount Percentage:</label>
            <input
              type="number"
              id="discountPercentage"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              required
              min="1"
              max="100"
            />
          </div>
          <button type="submit" className="add-discount-btn">Add Discount</button>
        </form>
      </div>

      <div className="discounts-list">
        <h2>Existing Discounts</h2>
        {discounts.length === 0 ? (
          <p>No discounts available.</p>
        ) : (
          <ul>
            {discounts.map((discount) => (
              <li key={discount.discount_id} className="discount-item">
                <p><strong>Code:</strong> {discount.discount_code}</p>
                <p><strong>Valid From:</strong> {new Date(discount.validity_start_date).toLocaleDateString()}</p>
                <p><strong>Valid Until:</strong> {new Date(discount.validity_end_date).toLocaleDateString()}</p>
                <p><strong>Discount:</strong> {discount.discount_percentage}% off</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Discounts;
