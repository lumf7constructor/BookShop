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

  // Fetch books from the backend
  useEffect(() => {
    fetch("http://localhost:5000/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Ensure fields are filled
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
      setLoading(true); // Set loading state to true while submitting
      console.log("Review Data:", reviewData); // Debug log

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
      } else {
        alert(data.error || "Failed to submit review.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    } finally {
      setLoading(false); // Reset loading state after submission
    }
  };

  return (
    <div className="reviews-container">
      <Navbar /> {/* Add Navbar if needed */}
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
                {num}
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
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default Reviews;
