const mongoose = require('mongoose')

const Home8 = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    post: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: String,
        trim: true,
        required: true
    },
    heading: {
        type: String,
        trim: true,
        required: true
    },
    paragraph: {
        type: String,
        trim: true,
        required: true
    }
})

module.exports = mongoose.model('Home8', Home8)