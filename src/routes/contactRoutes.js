const express = require("express");
const EmailController = require("../controllers/contactController");

const router = express.Router();

// CRUD routes for emails
router.get("/", EmailController.getEmails);        // Get all emails
router.get("/:id", EmailController.getEmail);      // Get email by ID
router.post("/", EmailController.createEmail);     // Create new email
router.put("/:id", EmailController.updateEmail);   // Update email
router.delete("/:id", EmailController.deleteEmail);// Delete email

router.post("/check-subscription", EmailController.checkSubscription);

module.exports = router;
