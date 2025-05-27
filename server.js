const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
app.use(cors());

// Anime endpoints
app.get('/anime/:endpoint', async (req, res) => {
  const endpoint = req.params.endpoint;
  const url = `https://api.consumet.org/anime/gogoanime/${endpoint}`;
  const response = await fetch(url + (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''));
  const data = await response.json();
  res.json(data);
});
app.get('/anime/info/:id', async (req, res) => {
  const url = `https://api.consumet.org/anime/gogoanime/info/${req.params.id}`;
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
});

// Manga endpoints
app.get('/manga/:endpoint', async (req, res) => {
  const endpoint = req.params.endpoint;
  const url = `https://api.consumet.org/manga/mangadex/${endpoint}`;
  const response = await fetch(url + (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''));
  const data = await response.json();
  res.json(data);
});
app.get('/manga/info/:id', async (req, res) => {
  const url = `https://api.consumet.org/manga/mangadex/info/${req.params.id}`;
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Proxy running on ${PORT}`));