const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Meghana@2004",  
  database: "aakruthi_task_db"
});

db.connect(err => {
  if (err) {
    console.error("MySQL connection failed:", err);
  } else {
    console.log("MySQL connected");
  }
});

module.exports = db;