const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.get("/fetch", notificationController.fetchNotifications);
router.put("/read", notificationController.markAsRead);

module.exports = router;
