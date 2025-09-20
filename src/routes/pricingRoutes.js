const express = require("express");
const PriceingController = require("../controllers/priceingController");

const router = express.Router();

router.post("/", PriceingController.createPriceing);
router.post("/check-subscription", PriceingController.checkSubscription);

module.exports = router;
