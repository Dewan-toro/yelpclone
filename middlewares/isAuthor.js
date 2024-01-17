const Place = require("../models/place");

module.exports.isAuthorPlace = async (req, res, next) => {
  const { id } = req.params;
  const place = await Place.findById(id);
  if (!place.author.equals(req.user._id)) {
    req.flash("error_msg", "Not authorized");
    return res.redirect("/places");
  }
  next();
};
