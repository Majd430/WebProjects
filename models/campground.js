const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review")


const imageSchema = new Schema({
    url: String,
    filename: String
});

imageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200")
})

const opts = { toJSON: { virtuals: true } };

const campGroundSchema = new Schema({
    title: String,
    images: [imageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, opts);

campGroundSchema.virtual("properties.popUpMarkUp").get(function () {
    return `<strong>
            <a href="/campgrounds/${this._id}" style="text-decoration: none;">${this.title}</a>
            <strong>
            <p>${this.description.substring(0, 20)}...</p>`
});

campGroundSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } })
    }
})

module.exports = mongoose.model("Campground", campGroundSchema)