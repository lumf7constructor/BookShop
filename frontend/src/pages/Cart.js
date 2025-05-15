import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "../styles/Cart.css";

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

  const [discountCode, setDiscountCode] = useState("");
  const [discountMessage, setDiscountMessage] = useState("");
  const [discountedTotal, setDiscountedTotal] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [loading, setLoading] = useState(false);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      const itemPrice = parseFloat(item.price);
      const quantity = parseInt(item.quantity);
      const itemTotal = Math.round(itemPrice * quantity * 100); 
      return sum + itemTotal;
    }, 0);
    return (total / 100); 
  };

  const formatPrice = (price) => {
    return (Math.round(parseFloat(price) * 100) / 100).toFixed(2);
  };

  const totalPrice = calculateTotal(cart);

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

  const handleDiscountChange = (e) => {
    setDiscountCode(e.target.value.toUpperCase());
    setDiscountedTotal(null);
    setDiscountMessage("");
    setDiscountPercentage(0);
  };

  const validateDiscountCode = async () => {
    if (!discountCode) {
      setDiscountMessage("error: Please enter a discount code");
      return;
    }

    setLoading(true);
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const response = await fetch(`http://localhost:5000/validate-discount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          discount_code: discountCode,
          current_date: currentDate
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setDiscountPercentage(data.discount_percentage);
        const discountAmount = Math.round(totalPrice * (data.discount_percentage / 100) * 100) / 100;
        const discountedAmount = Math.round((totalPrice - discountAmount) * 100) / 100;
        setDiscountedTotal(discountedAmount);
        setDiscountMessage(`Discount code valid! ${data.discount_percentage}% off`);
      } else {
        setDiscountMessage(`error: ${data.message}`);
        setDiscountedTotal(null);
        setDiscountPercentage(0);
      }
    } catch (error) {
      console.error("Error validating discount:", error);
      setDiscountMessage("error: Error validating discount code");
      setDiscountedTotal(null);
      setDiscountPercentage(0);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const completeOrder = async () => {
    if (!customerInfo.firstName || !customerInfo.lastName || 
        !customerInfo.address || !customerInfo.phone) {
      setDiscountMessage("error: Please fill in all customer details");
      return;
    }

    if (cart.length === 0) {
      setDiscountMessage("error: Your cart is empty");
      return;
    }

    setLoading(true);
    const sessionId = localStorage.getItem("session_id") || generateSessionId();

    const books = cart.map((item) => ({
      book_id: item.book_id,
      quantity: item.quantity,
      price: parseFloat((item.price))
    }));

    const orderData = {
      session_id: sessionId,
      customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
      phone: customerInfo.phone,
      address: customerInfo.address,
      books: books,
      discount_code: discountedTotal !== null ? discountCode : null
    };

    try {
      const response = await fetch("http://localhost:5000/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Order placed successfully! ${data.discountApplied ? 
          `Discount applied: ${data.discountApplied}` : ''}`);
        setCart([]);
        localStorage.removeItem("cart");
        setCustomerInfo({ firstName: "", lastName: "", address: "", phone: "" });
        setDiscountCode("");
        setDiscountMessage("");
        setDiscountedTotal(null);
        setDiscountPercentage(0);
      } else {
        setDiscountMessage(`error: ${data.message || "Failed to place order"}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setDiscountMessage("error: Error placing order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateSessionId = () => {
    const newSessionId = "session_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("session_id", newSessionId);
    return newSessionId;
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="cart-container">
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
                  <p>Price: ${formatPrice(book.price)}</p>
                </div>
                <div className="quantity-controls">
                  <button 
                    onClick={() => increaseQuantity(book.book_id)}
                    disabled={loading}
                  >+</button>
                  <p>{book.quantity}</p>
                  <button 
                    onClick={() => decreaseQuantity(book.book_id)}
                    disabled={loading}
                  >-</button>
                </div>
                <button 
                  className="remove-btn" 
                  onClick={() => removeFromCart(book.book_id)}
                  disabled={loading}
                >
                  Remove
                </button>
              </div>
            ))}
            
            <h2 className="total">Total: ${formatPrice(totalPrice)}</h2>

            <div className="discount-section">
              <div className="discount-input">
                <input
                  type="text"
                  name="discountCode"
                  placeholder="Discount Code (Optional)"
                  value={discountCode}
                  onChange={handleDiscountChange}
                  disabled={loading}
                />
                <button 
                  onClick={validateDiscountCode}
                  className="validate-btn"
                  disabled={loading || !discountCode}
                >
                  {loading ? "Validating..." : "Validate Code"}
                </button>
              </div>
              {discountMessage && (
                <p className={discountMessage.includes("error:") ? "error-message" : "success-message"}>
                  {discountMessage.replace("error:", "")}
                </p>
              )}
              {discountedTotal !== null && (
                <h2 className="discounted-total">
                  Total After Discount: ${formatPrice(discountedTotal)}
                </h2>
              )}
            </div>

            <h2>Enter Your Details</h2>
            <div className="customer-form">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={customerInfo.firstName}
                onChange={handleInputChange}
                disabled={loading}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={customerInfo.lastName}
                onChange={handleInputChange}
                disabled={loading}
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={customerInfo.address}
                onChange={handleInputChange}
                disabled={loading}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={customerInfo.phone}
                onChange={handleInputChange}
                disabled={loading}
              />
              <button 
                onClick={completeOrder}
                disabled={loading || cart.length === 0}
              >
                {loading ? "Processing..." : "Complete Order"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;