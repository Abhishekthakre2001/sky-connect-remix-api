const express = require("express");
const EmailController = require("../controllers/emailController");

const router = express.Router();

// POST /api/mail
router.post("/", EmailController.sendEmail);

module.exports = router;
