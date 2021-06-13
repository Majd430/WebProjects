const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const mbxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeoCoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
}

module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    if (!camp) {
        req.flash("error", "Campground not found!");
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/show", { camp });
}

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    const camp = new Campground(req.body);
    camp.geometry = geoData.body.features[0].geometry;
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'You have successfully made a campground!')
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id);
    if (!foundCamp) {
        req.flash("error", "Campground not found!");
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit", { foundCamp })
}

module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    const foundCamp = await Campground.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename })); // we made it an array because our model does not accept
    // arrays, it accepts objects, so we make a separate array, then spread the array and push
    foundCamp.images.push(...imgs); //we use push because we do not want to override any previous images that might be inside the db
    foundCamp.geometry = geoData.body.features[0].geometry;
    await foundCamp.save();

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        //We are pulling from the db elements, from the array,all images where the filename of the image is inside the deleteImages
        await foundCamp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }

    req.flash('success', 'You have successfully updated the campground!')
    res.redirect(`/campgrounds/${foundCamp._id}`)
}

module.exports.destroyCampground = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'You have successfully deleted the campground!')
    res.redirect("/campgrounds")
}
