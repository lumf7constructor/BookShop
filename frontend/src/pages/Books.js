import React, { useState, useEffect } from "react";
import './Books.css'; 

const Book = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/books") // Fetch book data from backend
            .then(response => response.json())
            .then(data => {
                console.log("Fetched books:", data);
                setBooks(data);  // Store the books data
            })
            .catch(error => console.error("Error fetching books:", error));
    }, []);

    return (
        <div>
            <h1>Book List</h1>
            <div className="book-list">
                {books.map(book => {
                    // Remove spaces from the book title to match the image file name
                    const coverImage = `/book_covers/${book.title.replace(/\s+/g, '')}.jpg`;

                    return (
                        <div key={book.book_id} className="book-card">
                            <img
                                src={coverImage}  // Use the correct path to the image
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
