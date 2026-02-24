const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router.get("/fetch", taskController.fetchTasks);
router.put("/update-status", taskController.updateStatus);
router.delete("/delete", taskController.deleteTask);

router.get("/assignable-users", taskController.getAssignableUsers);
router.get("/report-to-users", taskController.fetchReportToUsers);
router.post("/create", taskController.createTask);



module.exports = router;
