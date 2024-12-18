const mongoose = require('mongoose')

const Home1 = new mongoose.Schema({
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
    video: {
        type: String,
        trim: true,
        required: true
    }
})

module.exports = mongoose.model('Home1', Home1)