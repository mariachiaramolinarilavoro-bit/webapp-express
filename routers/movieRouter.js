const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/', movieController.index);    // GET /movies
router.get('/:id', movieController.show); // GET /movies/:id
router.post('/:id/reviews', movieController.store); // POST /movies/:id/reviews

module.exports = router;