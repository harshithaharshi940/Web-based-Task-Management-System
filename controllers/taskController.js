const db = require("../config/db");

function addNotification(userId, message) {
  const sql = `
    INSERT INTO notifications (user_id, message)
    VALUES (?, ?)
  `;
  db.query(sql, [userId, message]);
}




/* ================= FETCH TASKS ================= */
exports.fetchTasks = (req, res) => {
  const sql = `
    SELECT 
      t.id,
      t.title,
      t.description,
      t.priority,
      t.deadline,
      t.status,
      t.assigned_to,
      t.created_by,
      u1.username AS assigned_to_name,
      u2.username AS created_by_name
    FROM tasks t
    LEFT JOIN users u1 ON t.assigned_to = u1.id
    LEFT JOIN users u2 ON t.created_by = u2.id
    ORDER BY t.deadline ASC
  `;

  db.query(sql, (err, tasks) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(tasks);
  });
};

/* ================= UPDATE STATUS ================= */
exports.updateStatus = (req, res) => {
  const { taskId, status } = req.body;

  const sql = "UPDATE tasks SET status = ? WHERE id = ?";

  db.query(sql, [status, taskId], err => {
    if (err) return res.json({ success: false });

    // Get task info for notification
  db.query(
    "SELECT title, assigned_to, created_by FROM tasks WHERE id = ?",
    [taskId],
    (err, result) => {
      if (!err && result.length > 0) {
        const task = result[0];

        addNotification(
          task.assigned_to,
          `Task "${task.title}" status updated to ${status}`
        );

        addNotification(
          task.created_by,
          `Task "${task.title}" status updated to ${status}`
        );
      }
    }
  );
    res.json({ success: true });
  });
};

/* ================= DELETE TASK ================= */
exports.deleteTask = (req, res) => {
  const { taskId, userId } = req.body;

  // 1️⃣ Get task details first
  const checkSql = `
    SELECT title, assigned_to, created_by
    FROM tasks
    WHERE id = ?
  `;

  db.query(checkSql, [taskId], (err, result) => {
    if (err || result.length === 0) {
      return res.json({ success: false });
    }

    const task = result[0];

    // 2️⃣ Only creator can delete
    if (Number(task.created_by) !== Number(userId)) {
      return res.status(403).json({ success: false });
    }

    // 3️⃣ Delete task
    const deleteSql = "DELETE FROM tasks WHERE id = ?";

    db.query(deleteSql, [taskId], err => {
      if (err) {
        return res.json({ success: false });
      }

      // 4️⃣ Notifications after delete
      addNotification(
        task.assigned_to,
        `Task "${task.title}" has been deleted`
      );

      addNotification(
        task.created_by,
        `You deleted task "${task.title}"`
      );

      // 5️⃣ Send response
      res.json({ success: true });
    });
  });
};


/* ================= FETCH ASSIGNABLE USERS ================= */
exports.getAssignableUsers = (req, res) => {
  const { role } = req.query;

  let allowedRoles = [];

  switch (role) {
    case "Admin":
      allowedRoles = ["CTO", "Manager", "Employee", "Intern"];
      break;
    case "CTO":
      allowedRoles = ["Manager", "Employee", "Intern"];
      break;
    case "Manager":
      allowedRoles = ["Employee", "Intern"];
      break;
    case "Employee":
      allowedRoles = ["Intern"];
      break;
    default:
      return res.json([]); // Intern or invalid role
  }

  const sql = `
    SELECT id, username, role
    FROM users
    WHERE role IN (?)
  `;

  db.query(sql, [allowedRoles], (err, result) => {
    if (err) {
      console.error("Assignable users error:", err);
      return res.status(500).json([]);
    }
    res.json(result);
  });
};


/* ================= FETCH REPORT TO USERS ================= */
exports.fetchReportToUsers = (req, res) => {
  const sql = "SELECT id, username, role FROM users WHERE role != 'Intern'";
  db.query(sql, (err, users) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(users);
  });
};

/* ================= CREATE TASK ================= */
exports.createTask = (req, res) => {
  const {
    title,
    description,
    priority,
    deadline,
    assigned_to,
    report_to,
    attachment,
    created_by,
    creator_role
  } = req.body;

  if (creator_role === "Intern") {
    return res.status(403).json({ success: false });
  }

  const sql = `
    INSERT INTO tasks
    (title, description, priority, deadline, assigned_to, report_to, attachment, created_by, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
  `;

  db.query(
  sql,
  [title, description, priority, deadline, assigned_to, report_to, attachment, created_by],
  (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ success: false });
    }

    // ✅ ADD NOTIFICATION HERE
    addNotification(
      assigned_to,
      `New task "${title}" has been assigned to you`
    );

    addNotification(
      created_by,
      `You assigned a new task "${title}"`
    );

    // ✅ Send response AFTER notifications
    res.json({ success: true });
  }
);

};
