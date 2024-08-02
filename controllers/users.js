const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Cinema = require('../models/cinema.js');
const isSignedIn = require('../middleware/is-signed-in.js');

router.get('/community', isSignedIn, async (req, res) => {
    try {
      const latestEntries = await Cinema.aggregate([
        {
          $sort: { createdAt: -1 }
        },
        {
          $group: {
            _id: "$user",
            latestEntry: { $first: "$$ROOT" }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "userDetails"
          }
        },
        {
          $unwind: "$userDetails"
        }
      ]);
  
      res.render('users/community.ejs', { latestEntries });
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });

module.exports = router;