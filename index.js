const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const DB = process.env.DB;
const PORT = process.env.PORT || 3001;

const pool = new Pool({
  connectionString: DB,
  ssl: {
    rejectUnauthorized: false, // Required for Neon
  },
});

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      );
    `);
    await pool.query(`INSERT INTO test_table (name) VALUES ('NeonTestUser') RETURNING *;`);
    console.log("Table initialized and record inserted.");
  } catch (err) {
    console.error("DB Initialization Error:", err);
  }
};

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM test_table;");
    res.json(result.rows);
  } catch (err) {
    console.error("Query Error:", err);
    res.status(500).send("Database query failed");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  initDb();
});
