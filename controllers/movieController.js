const connection = require('../database/connection');

// GET /movies — lista di tutti i film
function index(req, res, next) {
  const sql = 'SELECT * FROM movies';

  connection.query(sql, (err, results) => {
    if (err) return next(err);

    res.json(results);
  });
}

// GET /movies/:id — dettagli film + recensioni
function show(req, res, next) {
  const id = req.params.id;

  const movieSql = 'SELECT * FROM movies WHERE id = ?';

  connection.query(movieSql, [id], (err, movieResults) => {
    if (err) return next(err);

    if (movieResults.length === 0) {
      return res.status(404).json({ error: 'Film non trovato' });
    }

    const movie = movieResults[0];

    const reviewsSql = 'SELECT * FROM reviews WHERE movie_id = ?';

    connection.query(reviewsSql, [id], (err, reviewsResults) => {
      if (err) return next(err);

      movie.reviews = reviewsResults;
      res.json(movie);
    });
  });
}

// POST /movies/:id/reviews — salva nuova recensione

const store = (req, res) => {
  const movie_id = req.params.id;
  const { name, vote, text } = req.body;

  if (!name || !vote || !text) {
    return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
  }

  if (vote < 1 || vote > 5) {
    return res.status(400).json({ error: 'Il voto deve essere tra 1 e 5' });
  }

  const sql = 'INSERT INTO reviews (movie_id, name, vote, text) VALUES (?, ?, ?, ?)';

  connection.query(sql, [movie_id, name, vote, text], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    const newReview = {
      id: results.insertId,
      movie_id,
      name,
      vote,
      text
    };

    res.status(201).json(newReview);
  });
}

module.exports = { index, show, store };