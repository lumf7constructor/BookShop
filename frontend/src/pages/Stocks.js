import React, { useEffect, useState } from 'react';
import Navbar2 from './Navbar2';
import '../styles/stocks.css';

const Stocks = () => {
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    price: '',
    genre: '',
    stock_quantity: ''
  });

  const [books, setBooks] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [deleteQuantity, setDeleteQuantity] = useState('');
  const [selectedBookDetails, setSelectedBookDetails] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const res = await fetch('http://localhost:5000/books');  
    const data = await res.json();
    console.log("Books fetched:", data);  // Log to check data
    setBooks(data);
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook),
    });
    const data = await res.json();
    if (data.success) {
      setMessage('Book added successfully');
      setNewBook({ title: '', author: '', price: '', genre: '', stock_quantity: '' });
      fetchBooks();
    } else {
      setMessage(data.message);
    }
  };

  const handleTitleChange = (title) => {
    setSelectedTitle(title);
    const book = books.find(b => b.title === title);
    setSelectedBookDetails(book || null);
  };

  const handleReduceStock = async () => {
    if (!selectedBookDetails || !deleteQuantity || deleteQuantity <= 0) {
      alert("Please select a book and a valid quantity.");
      return;
    }
  
    const { book_id } = selectedBookDetails; 
    const reduce_by = parseInt(deleteQuantity); // Get the quantity to reduce
    
    try {
      const res = await fetch('http://localhost:5000/api/books/reduce-stock', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book_id, reduce_by }),
      });
  
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage('Stock reduced successfully');
        fetchBooks(); // Fetch updated books
        setDeleteQuantity('');
      } else {
        setMessage(data.error || "Failed to reduce stock.");
      }
    } catch (error) {
      console.error("Error during stock reduction:", error);
      setMessage("An error occurred while reducing stock.");
    }
  };
  
  

  return (
    <div className="stocks-page-container">
      <Navbar2 />
      <h1>Stock Management</h1>

      {message && <p className="message">{message}</p>}

      {/* Section 1: Add Book */}
      <section className="stocks-section">
        <h2 className="stocks-section-title">Add a New Book</h2>
        <form className="stocks-form" onSubmit={handleAddBook}>
          <input className="stocks-input" placeholder="Title" value={newBook.title} onChange={e => setNewBook({ ...newBook, title: e.target.value })} required />
          <input className="stocks-input" placeholder="Author" value={newBook.author} onChange={e => setNewBook({ ...newBook, author: e.target.value })} required />
          <input className="stocks-input" type="number" placeholder="Price" value={newBook.price} onChange={e => setNewBook({ ...newBook, price: e.target.value })} required />
          <select
            className="stocks-input"
            value={newBook.genre}
            onChange={e => setNewBook({ ...newBook, genre: e.target.value })}
            required
          >
            <option value="">-- Select Genre --</option>
            <option value="Fiction">Fiction</option>
            <option value="Mystery & Thriller">Mystery & Thriller</option>
            <option value="Science Fiction">Science Fiction</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Romance">Romance</option>
            <option value="Horror">Horror</option>
            <option value="Classic">Classic</option>
          </select>
          <input className="stocks-input" type="number" placeholder="Stock Quantity" value={newBook.stock_quantity} onChange={e => setNewBook({ ...newBook, stock_quantity: e.target.value })} required />
          <button className="stocks-button" type="submit">Add Book</button>
        </form>
      </section>

      {/* Section 2: Reduce Stock */}
      <section className="stocks-section">
        <h2 className="stocks-section-title">Reduce Book Stock</h2>
        <div className="stocks-stock-adjust">
          <select className="stocks-select" onChange={e => handleTitleChange(e.target.value)} value={selectedTitle}>
            <option value="">-- Select Book --</option>
            {books.map(book => (
              <option key={book.book_id} value={book.title}>{book.title}</option>
            ))}
          </select>

          {selectedBookDetails && (
            <>
              <p><strong>Author:</strong> {selectedBookDetails.author}</p>
              <p><strong>Price:</strong> ${selectedBookDetails.price}</p>
              <p><strong>Genre:</strong> {selectedBookDetails.genre}</p>
              <p><strong>Stock:</strong> {selectedBookDetails.stock_quantity}</p>
              <p><strong>Created At:</strong> {new Date(selectedBookDetails.created_at).toLocaleString()}</p>

              <input
                className="stocks-input"
                type="number"
                placeholder="Quantity to remove"
                value={deleteQuantity}
                onChange={e => setDeleteQuantity(e.target.value)}
                min="1"
                max={selectedBookDetails.stock_quantity}
              />
              <button className="stocks-button" onClick={handleReduceStock}>Delete from Stock</button>
            </>
          )}
        </div>
      </section>

      {/* Section 3: Increase Stock */}
      <section className="stocks-section">
        <h2 className="stocks-section-title">Increase Book Stock</h2>
        <div className="stocks-stock-adjust">
          <select
            className="stocks-select"
            onChange={e => handleTitleChange(e.target.value)}
            value={selectedTitle}
          >
            <option value="">-- Select Book --</option>
            {books.map(book => (
              <option key={book.book_id} value={book.title}>{book.title}</option>
            ))}
          </select>

          {selectedBookDetails && (
            <>
              <p><strong>Author:</strong> {selectedBookDetails.author}</p>
              <p><strong>Price:</strong> ${selectedBookDetails.price}</p>
              <p><strong>Genre:</strong> {selectedBookDetails.genre}</p>
              <p><strong>Stock:</strong> {selectedBookDetails.stock_quantity}</p>
              <p><strong>Created At:</strong> {new Date(selectedBookDetails.created_at).toLocaleString()}</p>

              <input
                className="stocks-input"
                type="number"
                placeholder="Quantity to add"
                value={deleteQuantity}
                onChange={e => setDeleteQuantity(e.target.value)}
                min="1"
              />
              <button
                className="stocks-button"
                onClick={async () => {
                  if (!selectedBookDetails || !deleteQuantity || deleteQuantity <= 0) {
                    alert("Please select a book and enter a valid quantity.");
                    return;
                  }

                  const { book_id } = selectedBookDetails;
                  const increase_by = parseInt(deleteQuantity);

                  try {
                    const res = await fetch('http://localhost:5000/api/books/increase-stock', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ book_id, increase_by }),
                    });

                    const data = await res.json();
                    if (res.ok && data.success) {
                      setMessage('Stock increased successfully');
                      fetchBooks();
                      setDeleteQuantity('');
                    } else {
                      setMessage(data.error || "Failed to increase stock.");
                    }
                  } catch (error) {
                    console.error("Error during stock increase:", error);
                    setMessage("An error occurred while increasing stock.");
                  }
                }}
              >
                Add to Stock
              </button>
            </>
          )}
        </div>
      </section>

    </div>
  );
};

export default Stocks;
