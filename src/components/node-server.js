// proxy-server.js
const express = require('express');
const fetch = require('node-fetch'); // or `import fetch from 'node-fetch'` in ES modules
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors()); // Enable CORS for all routes

app.get('/api/crops', async (req, res) => {
  const { filter } = req.query;
  try {
    const response = await fetch(`https://openfarm.cc/api/v1/crops/?filter=${filter}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch crop data' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
