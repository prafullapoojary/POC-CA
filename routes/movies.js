var express = require('express');
var router = express.Router();
const axios = require('axios');
const moment = require('moment');
const { check, validationResult } = require('express-validator');
const { movieRecommendationsValidation} = require('../validate');


function isShowingSoon(showingTime, currentTime) {
    console.log(showingTime,'showingTime','currentTime',currentTime)
    const [showingHour, showingMinute] = showingTime.split(':').map(Number);
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);

    return showingHour > currentHour || (showingHour === currentHour && showingMinute >= currentMinute + 30);
}


router.post('/movieRecommendations',movieRecommendationsValidation, async function (req, res, next) {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({status:false,message:errors.errors[0].msg});
        }
        let {genres,time}=req.body;
        const response = await axios.get(process.env.API_URL);
        let movies=response.data;
            const recommendations = movies.filter(movie => 
                movie.genres.includes(genres) &&
                movie.showings.some(showing => isShowingSoon(showing, time))
            ).sort((a, b) => b.rating - a.rating);
            
          
        if (recommendations.length === 0) {
            return res.status(200).json({ status: "no movie recommendations", data: [] })
        }

        return res.status(200).json({ status: "success", data: recommendations })
        
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
  });






module.exports = router;

