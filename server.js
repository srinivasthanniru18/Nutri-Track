const express = require('express');
const axios = require('axios');
const app = express();
const geminiApiKey = process.env.GEMINI_API_KEY; // Store your API key in environment variables

app.use(express.json());

app.post('/search', async (req, res) => {
  const { query } = req.body;

  try {
    // Call the Gemini API
    const response = await axios.post('https://api.gemini.com/v1/endpoint', {
      query,
    }, {
      headers: {
        'Authorization': `Bearer ${geminiApiKey}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from Gemini API' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));