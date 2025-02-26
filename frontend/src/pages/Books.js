import React, { useState, useEffect } from 'react';

const Books = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  return (
    <div>
      <h2>Book Titles</h2>
      <ul>
        {books.map((book, index) => (
          <li key={index}>{book.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Books;
