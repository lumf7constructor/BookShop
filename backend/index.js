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

app.get("/books", (req, res) => {
  db.query("SELECT title FROM book", (err, results) => {
    if (err) {
      res.status(500).json({ error: "Database query failed" });
    } else {
      res.json(results);
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
