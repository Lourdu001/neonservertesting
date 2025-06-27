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
    rejectUnauthorized: false, 
  },
});


app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM samplejson;");
    res.json(result.rows);
  } catch (err) {
    console.error("Query Error:", err);
    res.status(500).send("Database query failed");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
