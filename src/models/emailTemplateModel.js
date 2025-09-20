const db = require("../config/db"); // mysql2/promise pool

  function getAll() {
    console.log("in model");
    return db.query("SELECT * FROM email_template");
  }

function getById(id) {
  return db.query("SELECT * FROM email_template WHERE id = ?", [id]);
}

function create(data) {
  const sql = `
    INSERT INTO email_template 
    (Name, Subject, Email_body, Button_text, Shop_name, Logo_URL, Banner_URL, Header_color) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    data.Name,
    data.Subject,
    data.Email_body,
    data.Button_text,
    data.Shop_name,
    data.Logo_URL,
    data.Banner_URL,
    data.Header_color,
  ];
  return db.query(sql, values);
}

function update(id, data) {
  const sql = `
    UPDATE email_template 
    SET Name=?, Subject=?, Email_body=?, Button_text=?, Shop_name=?, Logo_URL=?, Banner_URL=?, Header_color=? 
    WHERE id=?
  `;
  const values = [
    data.Name,
    data.Subject,
    data.Email_body,
    data.Button_text,
    data.Shop_name,
    data.Logo_URL,
    data.Banner_URL,
    data.Header_color,
    id,
  ];
  return db.query(sql, values);
}

function remove(id) {
  return db.query("DELETE FROM email_template WHERE id = ?", [id]);
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
