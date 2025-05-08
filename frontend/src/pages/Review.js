import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "../styles/Reviews.css";

const Reviews = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedBookForView, setSelectedBookForView] = useState("");
  const [bookReviews, setBookReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Fetch books from the backend
  useEffect(() => {
    fetch("http://localhost:5000/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  const fetchBookReviews = async (bookId) => {
    if (!bookId) return;
    
    setLoadingReviews(true);
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${bookId}`);
      const data = await response.json();
      setBookReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleBookSelect = (e) => {
    const bookId = e.target.value;
    setSelectedBookForView(bookId);
    fetchBookReviews(bookId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBook || !customerName || !reviewText) {
      alert("Please fill in all fields.");
      return;
    }

    const reviewData = {
      bookTitle: selectedBook,
      customer_name: customerName,
      rating,
      review_text: reviewText,
    };

    try {
      setLoading(true);
      console.log("Review Data:", reviewData);

      const response = await fetch("http://localhost:5000/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Review submitted successfully!");
        setCustomerName("");
        setRating(5);
        setReviewText("");
        setSelectedBook("");
        // Refresh reviews if the submitted review is for the currently viewed book
        if (selectedBookForView) {
          fetchBookReviews(selectedBookForView);
        }
      } else {
        alert(data.error || "Failed to submit review.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="reviews-container">
        <div className="reviews-content">
          <div className="write-review-section">
            <h1 className="reviews-heading">Write a Review</h1>
            <form onSubmit={handleSubmit} className="reviews-form">
              <div className="form-group">
                <label>Book:</label>
                <select
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="select-group"
                >
                  <option value="">Select a book</option>
                  {books.map((book) => (
                    <option key={book.book_id} value={book.title}>
                      {book.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Rating:</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="select-group"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Star" : "Stars"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Review:</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>

          <div className="view-reviews-section">
            <h2>View Book Reviews</h2>
            <div className="form-group">
              <label>Select a Book:</label>
              <select
                value={selectedBookForView}
                onChange={handleBookSelect}
                className="select-group"
              >
                <option value="">Select a book</option>
                {books.map((book) => (
                  <option key={book.book_id} value={book.book_id}>
                    {book.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="reviews-list">
              {loadingReviews ? (
                <p className="loading-text">Loading reviews...</p>
              ) : bookReviews.length > 0 ? (
                bookReviews.map((review) => (
                  <div key={review.review_id} className="review-card">
                    <div className="review-header">
                      <span className="reviewer-name">{review.customer_name}</span>
                      <span className="review-rating">
                        {"⭐".repeat(review.rating)}
                      </span>
                      <span className="review-date">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="review-text">{review.review_text}</p>
                  </div>
                ))
              ) : selectedBookForView ? (
                <p className="no-reviews">No reviews made yet.</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;