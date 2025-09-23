const db = require("../config/db");

function getAll() {
    console.log("in model");
    return db.query("SELECT * FROM mail_history");
}

module.exports = {
    getAll
};
