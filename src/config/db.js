const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

// ✅ MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST ,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // number of parallel DB connections
  queueLimit: 0,
});

// ✅ Test DB connection at startup
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully!");
    connection.release(); // release back to pool
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); // exit app if DB fails
  }
})();

module.exports = pool;
