import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "../styles/Cart.css"; // Import the CSS file

const Cart = () => {
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
  });

  // Calculate total price
  const totalPrice = cart.reduce(
    (sum, book) => sum + book.price * book.quantity,
    0
  );

  // Update localStorage when cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const increaseQuantity = (book_id) => {
    setCart(
      cart.map((item) =>
        item.book_id === book_id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (book_id) => {
    setCart(
      cart
        .map((item) =>
          item.book_id === book_id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (book_id) => {
    setCart(cart.filter((item) => item.book_id !== book_id));
  };

  const handleInputChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const completeOrder = async () => {
    if (
      !customerInfo.firstName ||
      !customerInfo.lastName ||
      !customerInfo.address ||
      !customerInfo.phone
    ) {
      alert("Please fill in all customer details before completing the order.");
      return;
    }
  
    // Get session_id from localStorage or generate one if it doesn't exist
    const sessionId = localStorage.getItem("session_id") || generateSessionId();
  
    // Prepare the books array to send in the order
    const books = cart.map((item) => ({
      book_id: item.book_id,
      quantity: item.quantity,
      price: item.price,
    }));
  
    const orderData = {
      session_id: sessionId,  // Include session ID
      customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
      phone: customerInfo.phone,
      address: customerInfo.address,
      books: books, // Send the books array
    };
  
    // Send order details
    try {
      const response = await fetch("http://localhost:5000/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
  
      if (response.ok) {
        alert("Order placed successfully!");
        setCart([]);  // Clear cart after successful order
        localStorage.removeItem("cart");  // Remove cart from localStorage
        setCustomerInfo({ firstName: "", lastName: "", address: "", phone: "" });  // Reset form fields
      } else {
        const errorResponse = await response.json();
        alert(`Failed to place order: ${errorResponse.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order. Please try again.");
    }
  };
  

  // Helper function to generate a new session ID if not present
  const generateSessionId = () => {
    const newSessionId = "session_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("session_id", newSessionId); // Store new session ID
    return newSessionId;
  };

  return (
    <div className="cart-container">
      <Navbar /> {/* Add Navbar if needed */}
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty. Please add some books to view the cart!</p>
      ) : (
        <div>
          {cart.map((book) => (
            <div key={book.book_id} className="cart-item">
              <div>
                <h2>{book.title}</h2>
                <p>Author: {book.author}</p>
                <p>Price: ${book.price}</p>
              </div>
              <div className="quantity-controls">
                <button onClick={() => increaseQuantity(book.book_id)}>+</button>
                <p>{book.quantity}</p>
                <button onClick={() => decreaseQuantity(book.book_id)}>-</button>
              </div>
              <button className="remove-btn" onClick={() => removeFromCart(book.book_id)}>Remove</button>
            </div>
          ))}
          <h2 className="total">Total: ${totalPrice.toFixed(2)}</h2>

          <h2>Enter Your Details</h2>
          <div className="customer-form">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={customerInfo.firstName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={customerInfo.lastName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={customerInfo.address}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={customerInfo.phone}
              onChange={handleInputChange}
            />
            <button onClick={completeOrder}>Complete Order</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
