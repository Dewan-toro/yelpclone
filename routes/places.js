const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const ErrorHandler = require("../utils/ErrorHandler");
//models
const PlaceController = require("../controllers/places");

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

router
  .route("/")
  .get(wrapAsync(PlaceController.index))
  .post(isAuth, validatePlace, wrapAsync(PlaceController.store));

router.get("/create", isAuth, (req, res) => {
  res.render("places/create");
});

router
  .route("/:id")
  .get(isValidObjectID("/places"), wrapAsync(PlaceController.show))
  .put(
    isAuth,
    isAuthorPlace,
    isValidObjectID("/places"),
    validatePlace,
    wrapAsync(PlaceController.update)
  )
  .delete(
    isAuth,
    isAuthorPlace,
    isValidObjectID("/places"),
    wrapAsync(PlaceController.destroy)
  );

router.get(
  "/:id/edit",
  isAuth,
  isAuthorPlace,
  isValidObjectID("/places"),
  wrapAsync(PlaceController.edit)
);

module.exports = router;
