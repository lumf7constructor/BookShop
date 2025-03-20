import React, { useState, useEffect } from "react";
import Navbar from "./Navbar"; // Importing the Navbar component
import "../styles/Books.css";

const Book = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Track the search query
  const [suggestions, setSuggestions] = useState([]); // Track search suggestions
  const [cart, setCart] = useState([]); // Cart state

  const sessionId = "session-id-placeholder"; 

  // Fetch books with sorting option
  useEffect(() => {
    fetch(`http://localhost:5000/books?sort=${sortOption}`)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
        setFilteredBooks(data);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, [sortOption]);

  // Handle search input and suggestions
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(query)
    );
    setFilteredBooks(filtered);

    const suggestionsList = books
      .filter((book) => book.title.toLowerCase().includes(query))
      .map((book) => book.title);
    setSuggestions(suggestionsList);
  };

  const addToCart = (book) => {
    // Check if the book is already in the cart
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
  
    // Check if the book already exists in the cart
    const existingBook = existingCart.find((item) => item.book_id === book.book_id);
  
    if (existingBook) {
      // If book exists, increase quantity
      existingBook.quantity += 1;
    } else {
      // Otherwise, add the book with quantity 1
      book.quantity = 1;
      existingCart.push(book);
    }
  
    // Update the cart in localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart));
  
    // Update the cart state for immediate UI feedback
    setCart(existingCart);
  };
  

  // Checkout process (send order to backend)
  const handleCheckout = () => {
    const customerDetails = {
      session_id: sessionId,
      customer_name: "John Doe",
      phone: "1234567890",
      address: "123 Book St",
    };

    fetch("http://localhost:5000/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerDetails),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        setCart([]); // Clear cart on successful order
      })
      .catch((error) => console.error("Error during checkout:", error));
  };

  return (
    <div>
      <Navbar /> {/* Including the Navbar */}
      <h1>Books</h1>

      {/* Sort and Search bar container */}
      <div className="sort-search-container">
        <div className="sort-options">
          <label>Sort By: </label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Select</option>
            <option value="title_asc">Title (A to Z)</option>
            <option value="title_desc">Title (Z to A)</option>
            <option value="price_asc">Price (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
          </select>
        </div>

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
                <li
                  key={index}
                  onClick={() => setSearchQuery(suggestion)}
                  className="suggestion-item"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="book-list">
        {filteredBooks.map((book) => {
          const coverImage = `/book_covers/${book.title.replace(
            /\s+/g,
            ""
          )}.jpg`;

          return (
            <div key={book.book_id} className="book-card">
              <img
                src={coverImage}
                alt={book.title}
                className="book-cover"
                onError={(e) => (e.target.src = "/book_covers/default.jpg")}
              />
              <h2>{book.title}</h2>
              <p>Author: {book.author}</p>
              <p>Price: ${book.price}</p>
              <button onClick={() => addToCart(book)}>Add to Cart</button>
            </div>
          );
        })}
      </div>

      <button onClick={handleCheckout} className="checkout-button">
        Checkout
      </button>
    </div>
  );
};

export default Book;
