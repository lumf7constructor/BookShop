require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const { v4: uuidv4 } = require("uuid"); 
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();

// Enable CORS for all routes
app.use(cors()); 

// Middleware to parse JSON bodies
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "mern_user",  // Change if needed
  password: "your_password",  // Change if needed
  database: "bookshop",  // Change if needed
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Simple API route
app.get("/", (req, res) => {
  res.send("Bookshop API is running...");
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username = ?";

  db.query(query, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: "Server error" });
    if (results.length === 0) return res.json({ success: false });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.json({ success: false });

    res.json({ success: true });
  });
});

// API to fetch books with sorting and search
app.get("/books", (req, res) => {
  const sort = req.query.sort; // Get the sort query parameter
  const search = req.query.search || ''; // Get the search query parameter (default to empty string if not provided)

  let query = "SELECT book_id, title, author, price, genre, stock_quantity, created_at FROM book";
  
  // Add search logic if the search query is provided
  if (search) {
    query += ` WHERE title LIKE ?`; // Filter books by title
  }

  // Add sorting logic based on the query parameter
  if (sort === "title_asc") {
    query += " ORDER BY title ASC";
  } else if (sort === "title_desc") {
    query += " ORDER BY title DESC";
  } else if (sort === "price_asc") {
    query += " ORDER BY price ASC";
  } else if (sort === "price_desc") {
    query += " ORDER BY price DESC";
  }

  // Execute the query with the search term (if any)
  db.query(query, [`%${search}%`], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Add cover image path dynamically
    results.forEach(book => {
      book.cover_image = `http://localhost:5000/book_covers/${book.title}.jpg`;
    });

    res.json(results); // Send sorted and filtered results to the client
  });
});

app.post('/order', (req, res) => {
  const { session_id, customer_name, phone, address, books, discount_code } = req.body;

  if (!session_id || !customer_name || !phone || !address || !Array.isArray(books) || books.length === 0) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Missing required fields or empty books array' 
    });
  }

  // If discount code provided, verify it
  let discountPercentage = 0;
  if (discount_code) {
    const currentDate = new Date().toISOString().split('T')[0];
    const discountQuery = `
      SELECT discount_percentage 
      FROM discount_code 
      WHERE discount_code = ? 
      AND validity_start_date <= ? 
      AND validity_end_date >= ?
    `;

    db.query(discountQuery, [discount_code, currentDate, currentDate], (err, discountResults) => {
      if (err) {
        return res.status(500).json({ 
          status: 'error',
          message: 'Error checking discount code' 
        });
      }

      if (discountResults.length > 0) {
        discountPercentage = discountResults[0].discount_percentage;
        proceedWithOrder();
      } else {
        return res.status(400).json({ 
          status: 'error',
          message: 'Invalid or expired discount code' 
        });
      }
    });
  } else {
    proceedWithOrder();
  }

  function proceedWithOrder() {
    // Insert the order into the orders table
    const orderQuery = 'INSERT INTO orders (customer_name, phone, address, discount_code) VALUES (?, ?, ?, ?)';
    db.query(orderQuery, [customer_name, phone, address, discount_code || null], (err, result) => {
      if (err) {
        console.error("Error placing order:", err);
        return res.status(500).json({ 
          status: 'error',
          message: 'Failed to place order' 
        });
      }

      const orderId = result.insertId;

      // Calculate discounted prices if applicable
      const orderDetails = books.map((book) => {
        const originalPrice = book.price;
        const discountedPrice = discountPercentage > 0 
          ? originalPrice * (1 - discountPercentage / 100)
          : originalPrice;

        return [
          orderId,
          book.book_id,
          book.quantity,
          discountedPrice,
        ];
      });

      const orderDetailsQuery =
        'INSERT INTO order_details (order_id, book_id, quantity, price) VALUES ?';

      db.query(orderDetailsQuery, [orderDetails], (err) => {
        if (err) {
          console.error("Error adding order details:", err);
          return res.status(500).json({ 
            status: 'error',
            message: 'Failed to add order details' 
          });
        }

        res.status(200).json({ 
          status: 'success', 
          message: 'Order placed successfully!', 
          orderId: orderId,
          discountApplied: discountPercentage > 0 ? `${discountPercentage}%` : 'None',
          confirmation: 'Your order is being processed and will be shipped soon. Thank you for shopping with us!' 
        });
      });
    });
  }
});


// API to get top 10 bestsellers
app.get("/bestsellers", (req, res) => {
  const query = `
    SELECT 
      b.book_id, 
      b.title, 
      b.author, 
      b.price, 
      COALESCE(SUM(od.quantity), 0) AS total_sold
    FROM book b
    LEFT JOIN order_details od ON b.book_id = od.book_id
    GROUP BY b.book_id
    ORDER BY total_sold DESC
    LIMIT 10;
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch bestsellers" });
    }
    res.json(results);
  });
});

// Fetch all books for dropdown
app.get("/books", (req, res) => {
  const query = "SELECT book_id, title, author, price, genre, stock_quantity, created_at FROM book";
  
  db.query(query, (err, books) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch books" });
    }
    console.log(books); // Log the response to check what data we are getting
    res.json(books);
  });
});



// Handle review submission
app.post("/reviews", (req, res) => {
  const { bookTitle, customer_name, rating, review_text } = req.body;

  if (!bookTitle || !customer_name || !rating) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Get book_id from book title
  db.query("SELECT book_id FROM book WHERE title = ?", [bookTitle], (err, book) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch book" });
    }

    if (!book.length) {
      return res.status(400).json({ error: "Book not found" });
    }

    const book_id = book[0].book_id;
    const review_id = uuidv4(); // Generate a UUID for review_id

    // Insert review into database
    db.query(
      "INSERT INTO review (review_id, book_id, customer_name, rating, review_text) VALUES (?, ?, ?, ?, ?)",
      [review_id, book_id, customer_name, rating, review_text],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Failed to submit review" });
        }

        res.status(201).json({ message: "Review submitted successfully!" });
      }
    );
  });
});

app.post("/api/books/", (req, res) => {
  const { title, author, price, stock_quantity, genre } = req.body;

  if (!title || !author || !price || !stock_quantity || !genre) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    INSERT INTO book (title, author, price, stock_quantity, genre)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [title, author, price, stock_quantity, genre], (err, result) => {
    if (err) {
      console.error("Error inserting book:", err);
      return res.status(500).json({ error: "Failed to add book" });
    }
    res.status(201).json({ message: "Book added successfully!" });
  });
});


app.put("/api/books/reduce-stock", (req, res) => {
  const { book_id, reduce_by } = req.body;

  // Validate input
  if (!book_id || !reduce_by || reduce_by <= 0) {
    return res.status(400).json({ error: "Invalid book ID or quantity" });
  }

  const query = `
    UPDATE book 
    SET stock_quantity = stock_quantity - ?
    WHERE book_id = ? AND stock_quantity >= ?
  `;

  db.query(query, [reduce_by, book_id, reduce_by], (err, result) => {
    if (err) {
      console.error("Error updating stock:", err);
      return res.status(500).json({ error: "Failed to update stock" });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "Not enough stock or book not found" });
    }

    res.status(200).json({ success: true, message: "Stock reduced successfully" });
  });
});

app.put("/api/books/increase-stock", (req, res) => {
  const { book_id, increase_by } = req.body;

  // Validate input
  if (!book_id || !increase_by || increase_by <= 0) {
    return res.status(400).json({ error: "Invalid book ID or quantity" });
  }

  const query = `
    UPDATE book 
    SET stock_quantity = stock_quantity + ?
    WHERE book_id = ?
  `;

  db.query(query, [increase_by, book_id], (err, result) => {
    if (err) {
      console.error("Error updating stock:", err);
      return res.status(500).json({ error: "Failed to update stock" });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "Book not found" });
    }

    res.status(200).json({ success: true, message: "Stock increased successfully" });
  });
});


// Add this new route to fetch full order info
app.get('/api/orders/full-orders', (req, res) => {
  const query = `
    SELECT 
      o.order_id,
      o.customer_name,
      o.phone,
      o.address,
      o.created_at,
      o.discount_code,
      b.title,
      od.quantity,
      od.price
    FROM orders o
    JOIN order_details od ON o.order_id = od.order_id
    JOIN book b ON od.book_id = b.book_id
    ORDER BY o.order_id DESC, od.order_detail_id ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.get('/api/reviews', (req, res) => {
  const query = `
    SELECT r.review_id, b.title, r.customer_name, r.rating, r.review_text 
    FROM review r 
    JOIN book b ON r.book_id = b.book_id
  `;
  db.query(query, (err, results) => {  
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching reviews' });
    }
    res.json(results);
  });
});

app.delete('/api/reviews/:reviewId', (req, res) => {
  const { reviewId } = req.params;
  const query = 'DELETE FROM review WHERE review_id = ?';
  
  db.query(query, [reviewId], (err, results) => {  
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error deleting review' });
    }
    res.json({ message: 'Review deleted' });
  });
});

app.get('/api/discounts', (req, res) => {
  const query = 'SELECT * FROM discount_code';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching discounts:', err);
      return res.status(500).send('Server error');
    }
    res.json(results);
  });
});


// Example for handling POST request to add a new discount
app.post('/api/discounts', (req, res) => {
  const { discount_code, validity_start_date, validity_end_date, discount_percentage } = req.body;

  const query = 'INSERT INTO discount_code (discount_code, validity_start_date, validity_end_date, discount_percentage) VALUES (?, ?, ?, ?)';
  db.query(query, [discount_code, validity_start_date, validity_end_date, discount_percentage], (err, result) => {
    if (err) {
      console.error('Error inserting discount:', err);
      return res.status(500).send('Server error');
    }
    res.status(201).json({
      discount_id: result.insertId,
      discount_code,
      validity_start_date,
      validity_end_date,
      discount_percentage,
    });
  });
});

app.get("/api/analytics/top-books", (req, res) => {
  const query = `
    SELECT b.title, SUM(od.quantity) AS total_sold
    FROM order_details od
    JOIN book b ON od.book_id = b.book_id
    GROUP BY od.book_id
    ORDER BY total_sold DESC
    LIMIT 5;
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch data" });
    res.json(results);
  });
});

app.get("/api/analytics/orders-per-day", (req, res) => {
  const query = `
    SELECT DATE(created_at) AS order_date, COUNT(*) AS total_orders
    FROM orders
    GROUP BY DATE(created_at)
    ORDER BY order_date;
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch data" });
    res.json(results);
  });
});

app.get("/api/analytics/genre-distribution", (req, res) => {
  const query = `
    SELECT genre, COUNT(*) AS count
    FROM book
    GROUP BY genre;
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch data" });
    res.json(results);
  });
});

app.get("/api/analytics/low-stock", (req, res) => {
  const query = `
    SELECT title, author, stock_quantity
    FROM book
    WHERE stock_quantity < 10
    ORDER BY stock_quantity ASC;
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch data" });
    res.json(results);
  });
});

// Validate Discount
app.post('/validate-discount', (req, res) => {
  const { discount_code, current_date } = req.body;

  const discountQuery = `
    SELECT discount_percentage 
    FROM discount_code 
    WHERE discount_code = ? 
    AND validity_start_date <= ? 
    AND validity_end_date >= ?
  `;

  db.query(discountQuery, [discount_code, current_date, current_date], (err, results) => {
    if (err) {
      return res.status(500).json({ 
        status: 'error',
        message: 'Error checking discount code' 
      });
    }

    if (results.length > 0) {
      res.json({
        status: 'success',
        discount_percentage: results[0].discount_percentage
      });
    } else {
      res.status(400).json({ 
        status: 'error',
        message: 'Invalid or expired discount code' 
      });
    }
  });
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
