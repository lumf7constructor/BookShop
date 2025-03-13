require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
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

// API to fetch books with sorting and search
app.get("/books", (req, res) => {
  const sort = req.query.sort; // Get the sort query parameter
  const search = req.query.search || ''; // Get the search query parameter (default to empty string if not provided)

  let query = "SELECT book_id, title, author, price FROM book";
  
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

// Start the server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
