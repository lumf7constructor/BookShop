import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar2 from '../pages/Navbar2';
import '../styles/discounts.css';

const Discounts = () => {
  const [discountCode, setDiscountCode] = useState('');
  const [validityStartDate, setValidityStartDate] = useState('');
  const [validityEndDate, setValidityEndDate] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [discounts, setDiscounts] = useState([]);
  const [dateError, setDateError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/discounts');
      setDiscounts(response.data);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    }
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setValidityStartDate(newStartDate);
    validateDates(newStartDate, validityEndDate);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setValidityEndDate(newEndDate);
    validateDates(validityStartDate, newEndDate);
  };

  const validateDates = (startDate, endDate) => {
    if (startDate && endDate) {
      if (startDate >= endDate) {
        setDateError('End date must be after start date');
        return false;
      }
    }
    setDateError('');
    return true;
  };

  const isDiscountExpired = (endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(endDate);
    return expDate < today;
  };

  const handleAddDiscount = async (e) => {
    e.preventDefault();

    if (!validateDates(validityStartDate, validityEndDate)) {
      return;
    }

    setIsLoading(true);

    const newDiscount = {
      discount_code: discountCode.toUpperCase(),
      validity_start_date: validityStartDate,
      validity_end_date: validityEndDate,
      discount_percentage: parseInt(discountPercentage)
    };

    try {
      const response = await axios.post('http://localhost:5000/api/discounts', newDiscount);
      setDiscounts([...discounts, response.data]);
      // Reset form
      setDiscountCode('');
      setValidityStartDate('');
      setValidityEndDate('');
      setDiscountPercentage('');
      setDateError('');
      alert('Discount code added successfully!');
    } catch (error) {
      console.error('Error adding discount:', error);
      alert(error.response?.data?.message || 'Error adding discount code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDiscount = async (discountId) => {
    if (window.confirm('Are you sure you want to delete this discount code?')) {
      try {
        await axios.delete(`http://localhost:5000/api/discounts/${discountId}`);
        setDiscounts(discounts.filter(discount => discount.discount_id !== discountId));
        alert('Discount code deleted successfully!');
      } catch (error) {
        console.error('Error deleting discount:', error);
        alert('Error deleting discount code');
      }
    }
  };

  const renderDiscountItem = (discount) => (
    <li key={discount.discount_id} className="discount-item">
      <div className="discount-info">
        <p><strong>Code:</strong> {discount.discount_code}</p>
        <p><strong>Valid From:</strong> {new Date(discount.validity_start_date).toLocaleDateString()}</p>
        <p><strong>Valid Until:</strong> {new Date(discount.validity_end_date).toLocaleDateString()}</p>
        <p><strong>Discount:</strong> {discount.discount_percentage}% off</p>
      </div>
      <button 
        className="delete-btn"
        onClick={() => handleDeleteDiscount(discount.discount_id)}
      >
        Delete
      </button>
    </li>
  );

  const activeDiscounts = discounts.filter(d => !isDiscountExpired(d.validity_end_date));
  const expiredDiscounts = discounts.filter(d => isDiscountExpired(d.validity_end_date));

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
              onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
              placeholder="Enter discount code"
              required
              pattern="[A-Z0-9]+"
              title="Only uppercase letters and numbers allowed"
            />
          </div>
          <div className="form-group">
            <label htmlFor="validityStartDate">Start Date:</label>
            <input
              type="date"
              id="validityStartDate"
              value={validityStartDate}
              onChange={handleStartDateChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="form-group">
            <label htmlFor="validityEndDate">End Date:</label>
            <input
              type="date"
              id="validityEndDate"
              value={validityEndDate}
              onChange={handleEndDateChange}
              required
              min={validityStartDate || new Date().toISOString().split('T')[0]}
            />
          </div>
          {dateError && <div className="error-message">{dateError}</div>}
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
              placeholder="Enter percentage (1-100)"
            />
          </div>
          <button 
            type="submit" 
            className="add-discount-btn"
            disabled={isLoading || !!dateError}
          >
            {isLoading ? 'Adding...' : 'Add Discount'}
          </button>
        </form>
      </div>

      <div className="discounts-list">
        <h2>Active Discount Codes</h2>
        {activeDiscounts.length === 0 ? (
          <p className="no-discounts">No active discounts available.</p>
        ) : (
          <ul>{activeDiscounts.map(renderDiscountItem)}</ul>
        )}

        <h2 className="expired-title">Expired Discount Codes</h2>
        {expiredDiscounts.length === 0 ? (
          <p className="no-discounts">No expired discounts.</p>
        ) : (
          <ul className="expired-discounts">
            {expiredDiscounts.map(renderDiscountItem)}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Discounts;