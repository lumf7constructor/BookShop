import React, { useState, useEffect } from "react";
import Navbar from './Navbar'; // Import the Navbar component
import '../styles/Books.css';

const Book = () => {
  const [books, setBooks] = useState([]);
  const [sortOption, setSortOption] = useState(''); // Track the selected sorting option

  // Fetch books with sorting option
  useEffect(() => {
    fetch(`http://localhost:5000/books?sort=${sortOption}`) // Pass the selected sort option
      .then(response => response.json())
      .then(data => {
        console.log("Fetched books:", data);
        setBooks(data);  // Store the books data
      })
      .catch(error => console.error("Error fetching books:", error));
  }, [sortOption]); // Re-fetch books whenever the sort option changes

  return (
    <div>
      <Navbar /> {/* Include the Navbar */}
      <h1>Book List</h1>
      
      {/* Sorting options */}
      <div className="sort-options">
        <label>Sort By: </label>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="">Select</option>
          <option value="title_asc">Title (A to Z)</option>
          <option value="title_desc">Title (Z to A)</option>
          <option value="price_asc">Price (Low to High)</option>
          <option value="price_desc">Price (High to Low)</option>
        </select>
      </div>

      <div className="book-list">
        {books.map(book => {
          const coverImage = `/book_covers/${book.title.replace(/\s+/g, '')}.jpg`;

          return (
            <div key={book.book_id} className="book-card">
              <img
                src={coverImage}
                alt={book.title}
                className="book-cover"
                onError={(e) => e.target.src = "/book_covers/default.jpg"} // Fallback if image not found
              />
              <h2>{book.title}</h2>
              <p>Author: {book.author}</p>
              <p>Price: ${book.price}</p>
              <button>Add to Cart</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Book;
