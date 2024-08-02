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

router.get('/newmovie', isSignedIn, (req, res) => {
  res.render('cinemas/newmovie.ejs');
});

router.post('/newmovie', isSignedIn, async (req, res) => {
  try {
    const newMovie = new Cinema({
      user: req.session.user._id,
      title: req.body.title,
      score: req.body.score,
      status: req.body.status,
      description: req.body.description,
      type: 'Movie'
    });
    await newMovie.save();
    res.redirect('/cinemas/dashboard');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/newtv', isSignedIn, (req, res) => {
  res.render('cinemas/newtv.ejs');
});

router.post('/newtv', isSignedIn, async (req, res) => {
  try {
    const newTVShow = new Cinema({
      user: req.session.user._id,
      title: req.body.title,
      score: req.body.score,
      status: req.body.status,
      description: req.body.description,
      type: 'TV Show'
    });
    await newTVShow.save();
    res.redirect('/cinemas/dashboard');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;
