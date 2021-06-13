const express = require("express");
const router = express.Router();

const errorHandlerAsync = require("../util/ErrorHandlerAsync");
const { isLoggedIn, isAuthorised, validateCampground } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });



router.route("/")
    .get(errorHandlerAsync(campgrounds.index))
    .post(isLoggedIn, upload.array("image"), validateCampground, errorHandlerAsync(campgrounds.createCampground));


router.get("/new", isLoggedIn, campgrounds.renderNewForm);


router.route("/:id")
    .get(errorHandlerAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthorised, upload.array("image"), validateCampground, errorHandlerAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthorised, errorHandlerAsync(campgrounds.destroyCampground));


router.get("/:id/edit", isLoggedIn, isAuthorised, errorHandlerAsync(campgrounds.renderEditForm))



module.exports = router;
