const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
//models
const PlaceController = require("../controllers/places");

//middleware
const isValidObjectID = require("../middlewares/isValidObjectID");
const isAuth = require("../middlewares/isAuth");
const { isAuthorPlace } = require("../middlewares/isAuthor");
const { validatePlace } = require("../middlewares/validator");
const upload = require("../config/multer");

const router = express.Router();

router
  .route("/")
  .get(wrapAsync(PlaceController.index))
  .post(isAuth, upload.array("image", 5), validatePlace, wrapAsync(PlaceController.store));

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
