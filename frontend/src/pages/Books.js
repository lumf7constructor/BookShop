import React, { useState, useEffect } from "react";
import Navbar from './Navbar'; // Import the Navbar component
import '../styles/Books.css';

const Book = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Track the search query
  const [suggestions, setSuggestions] = useState([]); // Track search suggestions

  // Fetch books with sorting option
  useEffect(() => {
    fetch(`http://localhost:5000/books?sort=${sortOption}`)
      .then(response => response.json())
      .then(data => {
        setBooks(data);  // Store the books data
        setFilteredBooks(data);  // Initially show all books
      })
      .catch(error => console.error("Error fetching books:", error));
  }, [sortOption]);

  // Handle search input and suggestions
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter books by title based on the search query
    const filtered = books.filter(book => book.title.toLowerCase().includes(query));
    setFilteredBooks(filtered);

    // Show suggestions based on the search query
    const suggestionsList = books
      .filter(book => book.title.toLowerCase().includes(query))
      .map(book => book.title);
    setSuggestions(suggestionsList);
  };

  return (
    <div>
      <Navbar /> {/* Include the Navbar */}
      <h1>Book List</h1>

      {/* Sort and Search bar container */}
      <div className="sort-search-container">
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

        {/* Search bar */}
        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search for books..."
            className="search-bar"
          />
          {suggestions.length > 0 && searchQuery && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => setSearchQuery(suggestion)} className="suggestion-item">
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="book-list">
        {filteredBooks.map(book => {
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
