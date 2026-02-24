const db = require("../config/db");

/* Fetch notifications for a user */
exports.fetchNotifications = (req, res) => {
  const { userId } = req.query;

  const sql = `
    SELECT id, message, is_read, created_at
    FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

/* Mark all notifications as read */
exports.markAsRead = (req, res) => {
  const { userId } = req.body;

  const sql = `
    UPDATE notifications
    SET is_read = 1
    WHERE user_id = ?
  `;

  db.query(sql, [userId], err => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
};
