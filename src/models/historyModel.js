const db = require("../config/db");

function getAll(shopId) {
    console.log("in model");
    return db.query("SELECT * FROM mail_history WHERE shop_id = ?", [shopId]);
}

module.exports = {
    getAll
};
