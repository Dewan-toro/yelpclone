module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error_msg", "Please login first");
    res.redirect("/login");
  } else {
    next();
  }
};
