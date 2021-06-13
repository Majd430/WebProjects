const BaseJOI = require("joi");
const sanitizeHTML = require("sanitize-html"); 

const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} must not include HTML!" 
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if(clean !== value) return helpers.error("string.escapeHTML", { value })
                return clean;
            }
        }
    }
});

const JOI = BaseJOI.extend(extension);

module.exports.campgroundSchema = JOI.object({
    title: JOI.string().required().escapeHTML(),
    // image: JOI.string().required(),
    price: JOI.number().required().min(10),
    location: JOI.string().required().escapeHTML(),
    description: JOI.string().required().escapeHTML(),
    deleteImages: JOI.array()
});

module.exports.reviewSchema = JOI.object({
    body: JOI.string().required().escapeHTML(),
    rating: JOI.number().required().min(1).max(5)
});