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

module.exports = { index, show };