const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to Postgres
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
});

// Ensure table exists
pool.query(`
  CREATE TABLE IF NOT EXISTS interests (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    phone VARCHAR(20),
    interested BOOLEAN
  );
`);

// API endpoint
app.post('/api/interest', async (req, res) => {
  const { username, phone, interested } = req.body;
  try {
    await pool.query('INSERT INTO interests (username, phone, interested) VALUES ($1, $2, $3)', [username, phone, interested]);
    res.send({ message: 'Thanks for your response!' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Database insert failed' });
  }
});

app.get('/api/interests', async (req, res) => {
  const result = await pool.query('SELECT * FROM interests');
  res.send(result.rows);
});

app.listen(3000, () => console.log('Backend running on port 3000'));
