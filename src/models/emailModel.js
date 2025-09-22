const db = require("../config/db"); // your MySQL connection pool

class EmailModel {
  // static async getAll(req) {
  //   console.log("req id",req.body)
  //   const [rows] = await db.query("SELECT * FROM emails ORDER BY id DESC");
  //   return rows;
  // }
  static async getAll(req) {
    console.log("req body", req.body);

    const { id } = req.body;
    const [rows] = await db.query(
      "SELECT * FROM emails WHERE shop_id = ? ORDER BY id DESC",
      [id]
    );
    return rows;
  }


  static async getById(id) {
    const [rows] = await db.query("SELECT * FROM emails WHERE id = ?", [id]);
    return rows[0];
  }

  static async create(data) {
    console.log("data", data)
    const { shop_id, name, email, mobile_number } = data; // <-- include it
    const [result] = await db.query(
      "INSERT INTO emails (shop_id, name, email, mobile_number) VALUES (?, ?, ?, ?)",
      [shop_id, name, email, mobile_number]
    );
    return { id: result.insertId, ...data };
  }

  static async update(id, data) {
    const { shop_id, name, email, mobile_number } = data;
    await db.query(
      "UPDATE emails SET shop_id = ?, name = ?, email = ?, mobile_number = ? WHERE id = ?",
      [shop_id, name, email, mobile_number, id]
    );
    return this.getById(id);
  }


  static async delete(id) {
    await db.query("DELETE FROM emails WHERE id = ?", [id]);
    return { message: "Email deleted" };
  }
}

module.exports = EmailModel;
