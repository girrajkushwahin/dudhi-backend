const mongoose = require('mongoose')

const Home3 = new mongoose.Schema({
    heading: {
        type: String,
        trim: true,
        required: true
    },
    paragraph: {
        type: String,
        trim: true,
        required: true
    },
    image1: {
        type: String,
        trim: true,
        required: true
    },
    image2: {
        type: String,
        trim: true,
        required: true
    },
    image3: {
        type: String,
        trim: true,
        required: true
    }
})

module.exports = mongoose.model('Home3', Home3)