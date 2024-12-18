const mongoose = require('mongoose')
const validator = require('validator');

const Home7 = new mongoose.Schema({
    text: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: String,
        trim: true,
        required: true
    },
    link: {
        type: String,
        trim: true,
        required: true,
        validate: {
            validator: function (value) {
                return validator.isURL(value);
            },
            message: 'Invalid link'
        },
    }
})

module.exports = mongoose.model('Home7', Home7)