const HistoryTemplate = require("../models/historyModel");

async function gethistory(req, res, next) {
  console.log("in controller", req.query);  // use query params
 const shopId = req.query.shop_id; 
  try {
    const [rows] = await HistoryTemplate.getAll(shopId);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}


module.exports = {
  gethistory
};