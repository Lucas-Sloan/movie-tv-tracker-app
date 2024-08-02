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

router.get('/movies', isSignedIn, async (req, res) => {
  try {
    const userId = req.session.user._id;
    const movies = await Cinema.find({ user: userId, type: 'Movie' });

    res.render('cinemas/movies.ejs', {
      user: req.session.user,
      movies
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
      notes: req.body.notes,
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
      notes: req.body.notes,
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

router.get('/show/:id', isSignedIn, async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);
    res.render('cinemas/show.ejs', {
      cinema,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/cinemas/dashboard');
  }
});

router.get('/editmovies/:id', isSignedIn, async (req, res) => {
  try {
    const movie = await Cinema.findById(req.params.id);
    res.render('cinemas/editmovies.ejs', {
      movie,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/cinemas/dashboard');
  }
});

router.post('/editmovies/:id', isSignedIn, async (req, res) => {
  try {
    await Cinema.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      score: req.body.score,
      status: req.body.status,
      description: req.body.description,
      notes: req.body.notes,
    });
    res.redirect('/cinemas/dashboard');
  } catch (error) {
    console.log(error);
    res.redirect('/cinemas/dashboard');
  }
});

router.get('/edit-tv/:id', isSignedIn, async (req, res) => {
  try {
    const tvshow = await Cinema.findById(req.params.id);
    res.render('cinemas/edit-tv.ejs', {
      tvshow,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/cinemas/dashboard');
  }
});

router.post('/edit-tv/:id', isSignedIn, async (req, res) => {
  try {
    await Cinema.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      score: req.body.score,
      status: req.body.status,
      description: req.body.description,
      notes: req.body.notes,
    });
    res.redirect('/cinemas/dashboard');
  } catch (error) {
    console.log(error);
    res.redirect('/cinemas/dashboard');
  }
});

module.exports = router;
