import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar2 from '../pages/Navbar2'; // Use your manager navbar
import '../styles/reviews2.css'; // Optional: create this if you want custom styles

const Reviews2 = () => {
  const [reviews, setReviews] = useState([]);
  
  // Fetch reviews on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/reviews')
      .then(response => {
        setReviews(response.data);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
      });
  }, []);

  // Handle review deletion
  const deleteReview = (reviewId) => {
    axios.delete(`http://localhost:5000/api/reviews/${reviewId}`)
      .then(() => {
        // Remove deleted review from the state
        setReviews(reviews.filter(review => review.review_id !== reviewId));
      })
      .catch(error => {
        console.error('Error deleting review:', error);
      });
  };

  return (
    <div className="reviews2-page">
      <Navbar2 />
      <h1>⭐ Reviews</h1>
      <p className="reviews2-info">Here you'll be able to manage and view your reviews.</p>

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p>No reviews found.</p>
        ) : (
          reviews.map((review) => (
            <div className="review-item" key={review.review_id}>
              <h3>{review.title}</h3>
              <p><strong>Reviewer:</strong> {review.customer_name}</p>
              <p><strong>Rating:</strong> {review.rating} / 5</p>
              <p><strong>Comment:</strong> {review.review_text}</p>
              <button onClick={() => deleteReview(review.review_id)}>Delete Review</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews2;
