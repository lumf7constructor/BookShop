import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "../styles/Bestsellers.css";


const Bestsellers = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/bestsellers")
      .then((response) => response.json())
      .then((data) => setBestsellers(data))
      .catch((error) => console.error("Error fetching bestsellers:", error));
  }, []);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const addToCart = (book) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find((item) => item.book_id === book.book_id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({ ...book, quantity: 1 });
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div>
      <Navbar />
      <h1>Check out our top 10 best-selling books!</h1>
       {/* <p>Check out our top 10 best-selling books!</p>  */}

      <div className="book-list1">
        {bestsellers.map((book) => {
          const coverImage = `/book_covers/${book.title.replace(/\s+/g, "")}.jpg`;

          return (
            <div key={book.book_id} className="book-card1">
              <img
                src={coverImage}
                alt={book.title}
                className="book-cover1"
                onError={(e) => (e.target.src = "/book_covers/default.jpg")}
              />
              <h2>{book.title}</h2>
              <p>Author: {book.author}</p>
              <p>Price: ${book.price}</p>
              <p>Total Sold: {book.total_sold}</p>
              <button onClick={() => addToCart(book)}>Add to Cart</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Bestsellers;