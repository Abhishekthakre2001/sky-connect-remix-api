const express = require("express");
const HistoryController = require("../controllers/historyController");

const router = express.Router();

// POST /api/history
router.get("/", HistoryController.gethistory);

module.exports = router;
