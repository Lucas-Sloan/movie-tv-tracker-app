const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/user.js');
const Cinema = require('../models/cinema.js');
const isSignedIn = require('../middleware/is-signed-in.js');

router.get('/community', isSignedIn, async (req, res) => {
  try {
    const latestEntries = await Cinema.aggregate([
      { $sort: { createdAt: -1 } },
      { $group: { _id: "$user", latestEntry: { $first: "$$ROOT" } } },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "userDetails" } },
      { $unwind: "$userDetails" }
    ]);

    res.render('users/community.ejs', { latestEntries, loggedInUser: req.session.user });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/binder/:userId', isSignedIn, async (req, res) => {
  try {
    const loggedInUser = req.session.user;
    const userId = req.params.userId;
    const user = await User.findById(userId);
    const movies = await Cinema.find({ user: userId, type: 'Movie' });
    const tvshows = await Cinema.find({ user: userId, type: 'TV Show' });

    res.render('users/users.ejs', {
      loggedInUser,
      user,
      movies,
      tvshows
    });
  } catch (error) {
    console.log(error);
    res.redirect('/users/community');
  }
});

router.get('/tvshows/:userId', isSignedIn, async (req, res) => {
  try {
    const loggedInUser = req.session.user;
    const userId = req.params.userId;
    const user = await User.findById(userId);
    const tvshows = await Cinema.find({ user: userId, type: 'TV Show' });

    res.render('users/tvshows.ejs', {
      loggedInUser,
      user,
      tvshows
    });
  } catch (error) {
    console.log(error);
    res.redirect('/users/community');
  }
});

router.get('/movies/:userId', isSignedIn, async (req, res) => {
  try {
    const loggedInUser = req.session.user;
    const userId = req.params.userId;
    const user = await User.findById(userId);
    const movies = await Cinema.find({ user: userId, type: 'Movie' });

    res.render('users/movies.ejs', {
      loggedInUser,
      user,
      movies
    });
  } catch (error) {
    console.log(error);
    res.redirect('/users/community');
  }
});

router.get('/show/:id', isSignedIn, async (req, res) => {
  try {
    const loggedInUser = req.session.user;
    const cinema = await Cinema.findById(req.params.id).lean();
    const apiKey = process.env.OMDB_API_KEY;
    const response = await axios.get(`http://www.omdbapi.com/?t=${cinema.title}&apikey=${apiKey}`);
    const data = response.data;

    const description = data.Response === 'True' ? data.Plot : 'Description not available';

    res.render('users/show.ejs', {
      loggedInUser,
      cinema,
      description,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/users/community');
  }
});

module.exports = router;