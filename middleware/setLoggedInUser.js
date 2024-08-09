module.exports = (req, res, next) => {
    res.locals.loggedInUser = req.session.user;
    next();
};
  