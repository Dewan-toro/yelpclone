const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const ErrorHandler = require("../utils/ErrorHandler");
//models
const Place = require("../models/place");

//schemas
const { placeSchema } = require("../schemas/place");

//middleware
const isValidObjectID = require("../middlewares/isValidObjectID");
const isAuth = require("../middlewares/isAuth");
const { isAuthorPlace } = require("../middlewares/isAuthor");

const router = express.Router();

const validatePlace = (req, res, next) => {
  const { error } = placeSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return next(new ErrorHandler(msg, 400));
  } else {
    next();
  }
};

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const places = await Place.find();
    res.render("places/index", { places });
  })
);

router.get("/create", isAuth, (req, res) => {
  res.render("places/create");
});

router.post(
  "/",
  isAuth,
  validatePlace,
  wrapAsync(async (req, res, next) => {
    const place = new Place(req.body.place);
    await place.save();
    req.flash("success_msg", "Successfully made a new place!");
    res.redirect("/places");
  })
);

router.get(
  "/:id",
  isValidObjectID("/places"),
  wrapAsync(async (req, res) => {
    const place = await Place.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    res.render("places/show", { place });
  })
);

router.get(
  "/:id/edit",
  isAuth,
  isAuthorPlace,
  isValidObjectID("/places"),
  wrapAsync(async (req, res) => {
    const place = await Place.findById(req.params.id);
    res.render("places/edit", { place });
  })
);

router.put(
  "/:id",
  isAuth,
  isAuthorPlace,
  isValidObjectID("/places"),
  validatePlace,
  wrapAsync(async (req, res) => {
    await Place.findByIdAndUpdate(req.params.id, { ...req.body.place });
    req.flash("success_msg", "Place updated successfully");

    res.redirect(`/places/${req.params.id}`);
  })
);

router.delete(
  "/:id",
  isAuth,
  isAuthorPlace,
  isValidObjectID("/places"),
  wrapAsync(async (req, res) => {
    await Place.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Place deleted successfully");
    res.redirect("/places");
  })
);

module.exports = router;
