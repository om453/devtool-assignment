import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Setup SQLite DB
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPromise = open({
  filename: path.join(__dirname, 'devtool.db'),
  driver: sqlite3.Database,
});

(async () => {
  const db = await dbPromise;
  await db.exec(`CREATE TABLE IF NOT EXISTS json_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original TEXT NOT NULL,
    formatted TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
})();

// POST /format-Json
app.post('/format-Json', async (req, res) => {
  const { json } = req.body;
  try {
    const parsed = JSON.parse(json);
    const pretty = JSON.stringify(parsed, null, 2);
    // Save to DB for history (bonus)
    const db = await dbPromise;
    await db.run('INSERT INTO json_history (original, formatted) VALUES (?, ?)', json, pretty);
    res.json({ success: true, formatted: pretty });
  } catch (err) {
    res.status(400).json({ success: false, error: 'Invalid JSON' });
  }
});

// POST /encode
app.post('/encode', (req, res) => {
  const { text } = req.body;
  if (typeof text !== 'string') {
    return res.status(400).json({ success: false, error: 'Text is required' });
  }
  const encoded = Buffer.from(text, 'utf-8').toString('base64');
  res.json({ success: true, result: encoded });
});

// POST /decode
app.post('/decode', (req, res) => {
  const { base64 } = req.body;
  try {
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');
    res.json({ success: true, result: decoded });
  } catch (err) {
    res.status(400).json({ success: false, error: 'Invalid Base64' });
  }
});

// (Bonus) GET /json-history
app.get('/json-history', async (req, res) => {
  try {
    const db = await dbPromise;
    const rows = await db.all('SELECT id, original, formatted, created_at FROM json_history ORDER BY created_at DESC');
    res.json({ success: true, history: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch history' });
  }
});

app.listen(PORT, () => {
  console.log(`Dev Toolbox backend running on port ${PORT}`);
}); 