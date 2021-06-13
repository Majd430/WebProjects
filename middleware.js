const Campground = require("./models/campground");
const Review = require("./models/review");
const { campgroundSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./util/ExpressError")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}


// module.exports.isLoggedIn = (req, res, next) => {
//     if (!req.isAuthenticated()) {
//         req.session.returnTo = req.originalUrl;
//         req.flash('error', "You must be logged in first");
//         return res.redirect("/login");
//     }
//     next();
// }

module.exports.validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.isAuthorised = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', "You do not have permission to do that!")
        return res.redirect(`/campgrounds/${id}`)
        //Remeber to always return at the end, so that it will return a promise and stop
    }
    next()
}

module.exports.validateReview = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.isReviewerAuthorised = async (req, res, next) => {
    const { reviewId, id } = req.params;

    //here we want the reviewId actually, not the campground id with {id} since we will look for the Id of the review itself
    //and the user that wrote it then compare the id of the user that wrote it with the current logged in user

    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "You do not have permission to do that!")
        return res.redirect(`/campgrounds/${id}`)
        //Remeber to always return at the end, so that it will return a promise and stop
    }
    next()
}