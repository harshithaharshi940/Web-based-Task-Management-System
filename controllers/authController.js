const db = require("../config/db");

exports.login = (req, res) => {
  const { username, password } = req.body;

  console.log("LOGIN ATTEMPT:", username, password);

  const sql = "SELECT * FROM users";

  db.query(sql, (err, users) => {
    if (err) return res.status(500).json(err);

    console.log("ALL USERS:", users);

    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      res.json({
        success: true,
        userId: user.id,
        role: user.role
      });
    } else {
      res.json({ success: false });
    }
  });
};
