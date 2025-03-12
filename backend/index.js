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


// API to fetch books
app.get("/books", (req, res) => {
    const query = "SELECT book_id, title, author, price FROM book";
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Add cover image path dynamically
        results.forEach(book => {
            book.cover_image = `http://localhost:5000/book_covers/${book.title}.jpg`;
        });

        res.json(results);
    });
});

// Start the server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
