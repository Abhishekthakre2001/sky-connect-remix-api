const db = require("../config/db"); // your MySQL connection pool

class EmailModel {
  static async getAll() {
    const [rows] = await db.query("SELECT * FROM emails ORDER BY id DESC");
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query("SELECT * FROM emails WHERE id = ?", [id]);
    return rows[0];
  }

  static async create(data) {
    const { shop_id, name, email } = data;
    const [result] = await db.query(
      "INSERT INTO emails (shop_id, name, email) VALUES (?, ?, ?)",
      [shop_id, name, email]
    );
    return { id: result.insertId, ...data };
  }

  static async update(id, data) {
    const { shop_id, name, email } = data;
    await db.query(
      "UPDATE emails SET shop_id = ?, name = ?, email = ? WHERE id = ?",
      [shop_id, name, email, id]
    );
    return this.getById(id);
  }

  static async delete(id) {
    await db.query("DELETE FROM emails WHERE id = ?", [id]);
    return { message: "Email deleted" };
  }
}

module.exports = EmailModel;
