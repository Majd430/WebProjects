const express = require("express");
const router = express.Router({ mergeParams: true });

//mergeParams: true THIS IS NEEDED, because the router keeps the params separate, thus not being able to find cmapground from req.params

const errorHandlerAsync = require("../util/ErrorHandlerAsync");
const { validateReview, isLoggedIn, isReviewerAuthorised } = require("../middleware");

const reviews = require("../controllers/reviews")


router.post("/", isLoggedIn, validateReview, errorHandlerAsync(reviews.createReview))

router.delete("/:reviewId", isLoggedIn, isReviewerAuthorised, errorHandlerAsync(reviews.destroyReview))

module.exports = router;