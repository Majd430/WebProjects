const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const name = `${sample(descriptors)} ${sample(places)}`;
        const location = `${cities[random1000].city}, ${cities[random1000].state}`;
        const campPrice = Math.floor(Math.random() * 20) + 10;
        // const geoData = await geocoder.forwardGeocode({
        //     query: location,
        //     limit: 1
        // }).send();

        const camp = new Campground({
            author: "60c61f2c4080e000158c5c0c",
            location: location,
            title: name,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            //geoData.body.features[0].geometry,
            images: [
                {
                    "url": "https://res.cloudinary.com/dpylleebx/image/upload/v1622564460/YelpCamp/ypnrmeszxbltlzg9e02z.jpg",
                    "filename": "YelpCamp/ypnrmeszxbltlzg9e02z"
                },
                {
                    "url": "https://res.cloudinary.com/dpylleebx/image/upload/v1622564460/YelpCamp/ye6eapvnjkfcuuxdlngw.jpg",
                    "filename": "YelpCamp/ye6eapvnjkfcuuxdlngw"
                }

            ],
            price: campPrice,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora distinctio ea ipsam cupiditate reprehenderit consectetur odio? Necessitatibus ullam impedit minima sed sunt, minus deserunt, provident voluptates voluptatum voluptatibus alias! Quaerat! Odit voluptate repellendus, autem aut numquam accusantium nesciunt placeat itaque beatae quas ratione vel distinctio sapiente, molestias perferendis reprehenderit doloremque! Error at totam deleniti? Veniam ipsa perferendis tempore praesentium eveniet."
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
});
