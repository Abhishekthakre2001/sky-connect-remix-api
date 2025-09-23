const HistoryTemplate = require("../models/historyModel");

async function gethistory(req, res, next) {
  console.log("in controller");
  try {
    const [rows] = await HistoryTemplate.getAll();
    res.json(rows);
  } catch (err) {
    next(err);
  }
}


module.exports = {
  gethistory
};