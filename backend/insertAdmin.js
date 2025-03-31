const mysql = require("mysql2");
const bcrypt = require("bcrypt");

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "mern_user",  // Change if needed
  password: "your_password",  // Change if needed
  database: "bookshop",  // Change if needed
});

const insertAdmin = async () => {
  const hashedPassword = await bcrypt.hash("admin", 10); // Hash the password
  const sql = "INSERT INTO users (username, password) VALUES (?, ?)";

  db.query(sql, ["admin", hashedPassword], (err, result) => {
    if (err) throw err;
    console.log("Admin user inserted successfully");
    db.end();
  });
};

insertAdmin();