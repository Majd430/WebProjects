const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMong = require("passport-local-mongoose");

const userCampSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

userCampSchema.plugin(passportLocalMong);

const User = mongoose.model("User", userCampSchema);

module.exports = User;