const Review = require("../models/review");
const Campground = require("../models/campground");


module.exports.createReview = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'You have successfully made a review!')
    res.redirect(`/campgrounds/${campground._id}`);
}


module.exports.destroyReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'You have successfully deleted your review!')
    res.redirect(`/campgrounds/${id}`)
}