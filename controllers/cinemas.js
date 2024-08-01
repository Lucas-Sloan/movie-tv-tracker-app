//controllers/cinemas.js
const express = require('express');
const router = express.Router();
const Cinema = require('../models/cinema.js');
const isSignedIn = require('../middleware/is-signed-in.js');

router.get('/dashboard', isSignedIn, async (req, res) => {
  try {
    const userId = req.session.user._id;
    const movies = await Cinema.find({ user: userId, type: 'Movie' });
    const tvshows = await Cinema.find({ user: userId, type: 'TV Show' });

    res.render('cinemas/dashboard.ejs', {
      user: req.session.user,
      movies,
      tvshows
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;
