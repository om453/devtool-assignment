import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// In-memory storage for JSON history (will reset on server restart)
let jsonHistory = [];
let historyId = 1;

// API Routes
app.post('/api/format-Json', async (req, res) => {
  const { json } = req.body;
  try {
    const parsed = JSON.parse(json);
    const pretty = JSON.stringify(parsed, null, 2);
    
    // Save to in-memory storage
    const historyItem = {
      id: historyId++,
      original: json,
      formatted: pretty,
      created_at: new Date().toISOString()
    };
    jsonHistory.unshift(historyItem);
    
    // Keep only last 50 items to prevent memory issues
    if (jsonHistory.length > 50) {
      jsonHistory = jsonHistory.slice(0, 50);
    }
    
    res.json({ success: true, formatted: pretty });
  } catch (err) {
    res.status(400).json({ success: false, error: 'Invalid JSON' });
  }
});

app.post('/api/encode', (req, res) => {
  const { text } = req.body;
  if (typeof text !== 'string') {
    return res.status(400).json({ success: false, error: 'Text is required' });
  }
  const encoded = Buffer.from(text, 'utf-8').toString('base64');
  res.json({ success: true, result: encoded });
});

app.post('/api/decode', (req, res) => {
  const { base64 } = req.body;
  try {
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');
    res.json({ success: true, result: decoded });
  } catch (err) {
    res.status(400).json({ success: false, error: 'Invalid Base64' });
  }
});

app.get('/api/json-history', async (req, res) => {
  try {
    res.json({ success: true, history: jsonHistory });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch history' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Dev Toolbox backend running on port ${PORT}`);
  });
}

// For Vercel deployment
export default app; 