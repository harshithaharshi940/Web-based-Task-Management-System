const db = require("../config/db");

/**
 * Get all users except interns
 * Used for "Report To" dropdown in Assign Task page
 */
exports.getReportToUsers = (req, res) => {
  const sql = `
    SELECT id, username, role
    FROM users
    WHERE role != 'Intern'
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching report-to users:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(result);
  });
};
