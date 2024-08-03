//controllers/cinemas.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
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

router.get('/tvshows', isSignedIn, async (req, res) => {
  try {
    const userId = req.session.user._id;
    const tvshows = await Cinema.find({ user: userId, type: 'TV Show' });

    res.render('cinemas/tvshows.ejs', {
      user: req.session.user,
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
    const cinema = await Cinema.findById(req.params.id).lean();
    const apiKey = process.env.OMDB_API_KEY;
    const response = await axios.get(`http://www.omdbapi.com/?t=${cinema.title}&apikey=${apiKey}`);
    const data = response.data;

    const description = data.Response === 'True' ? data.Plot : 'Description not available';

    res.render('cinemas/show.ejs', {
      cinema,
      description,
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

router.post('/delete-tv/:id', isSignedIn, async (req, res) => {
  try {
    await Cinema.findByIdAndDelete(req.params.id);
    res.redirect('/cinemas/dashboard');
  } catch (error) {
    console.log(error);
    res.redirect('/cinemas/dashboard');
  }
});

router.post('/delete-movie/:id', isSignedIn, async (req, res) => {
  try {
    await Cinema.findByIdAndDelete(req.params.id);
    res.redirect('/cinemas/dashboard');
  } catch (error) {
    console.log(error);
    res.redirect('/cinemas/dashboard');
  }
});

router.get('/titles', isSignedIn, async (req, res) => {
  try {
    const query = req.query.q;
    const apiKey = process.env.OMDB_API_KEY;
    const response = await axios.get(`http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
    const data = response.data;
    if (data.Response === 'True') {
      const titles = data.Search.map(item => item.Title);
      res.json(titles);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching titles:', error);
    res.status(500).json([]);
  }
});

router.get('/description', isSignedIn, async (req, res) => {
  try {
    const title = req.query.title;
    const apiKey = process.env.OMDB_API_KEY;
    const response = await axios.get(`http://www.omdbapi.com/?t=${title}&apikey=${apiKey}`);
    const data = response.data;
    if (data.Response === 'True') {
      res.json({ description: data.Plot });
    } else {
      res.json({ description: 'Description not available' });
    }
  } catch (error) {
    console.error('Error fetching description:', error);
    res.status(500).json({ description: 'Description not available' });
  }
});


module.exports = router;
