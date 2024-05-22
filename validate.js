
const { check } = require('express-validator');
exports.movieRecommendationsValidation = [
    check('genres', 'genres is Required').not().isEmpty(),
    check('time', 'time is Required').not().isEmpty()
]
