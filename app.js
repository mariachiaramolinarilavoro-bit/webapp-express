const express = require('express');
require('dotenv').config();

const movieRouter = require('./routers/movieRouter');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware per file statici (immagini in /public)
app.use(express.static('public'));

// Middleware per leggere JSON nel body
app.use(express.json());

// Rotte
app.use('/movies', movieRouter);

// Middleware 404 
app.use((req, res) => {
  res.status(404).json({ error: 'Rotta non trovata' });
});

// Middleware gestione errori 
app.use((err, req, res, next) => {
  console.error('Errore:', err);
  res.status(500).json({ error: 'Errore interno del server' });
});

app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});