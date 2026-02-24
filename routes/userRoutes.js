const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/**
 * Route to fetch users for "Report To" dropdown
 * Interns are excluded
 */
router.get("/report-to-users", userController.getReportToUsers);

module.exports = router;
