const axios = require('axios');
const { validationResult } = require('express-validator');

async function movieRecommendations(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, message: errors.errors[0].msg });
        }
        
        let { genres, time } = req.body;
        const response = await axios.get(process.env.API_URL);
        let movies = response.data;

        const recommendations = movies.filter(movie =>
            movie.genres.includes(genres) &&
            movie.showings.some(showing => isShowingSoon(showing, time))
        ).sort((a, b) => b.rating - a.rating);

        return res.status(200).json({ status: "success", data: recommendations });
        
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
}

function isShowingSoon(showingTime, currentTime) {
    const [showingHour, showingMinute] = showingTime.split(':').map(Number);
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);

    return showingHour > currentHour || (showingHour === currentHour && showingMinute >= currentMinute + 30);
}

module.exports = {
    movieRecommendations,
    isShowingSoon
};
