const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
//models
const ReviewController = require("../controllers/reviews");

//schemas

//middleware
const isValidObjectID = require("../middlewares/isValidObjectID");
const isAuth = require("../middlewares/isAuth");
const { isAuthorReview } = require("../middlewares/isAuthor");
const { validateReview } = require("../middlewares/validator");

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  isAuth,
  isValidObjectID("/places"),
  validateReview,
  wrapAsync(ReviewController.store)
);

router.delete(
  "/:review_id",
  isAuth,
  isAuthorReview,
  isValidObjectID("/places"),
  wrapAsync(ReviewController.destroy)
);

module.exports = router;
