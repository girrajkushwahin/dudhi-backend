const mongoose = require('mongoose')

const Home5 = new mongoose.Schema({
    heading: {
        type: String,
        trim: true,
        required: true
    },
    paragraph: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        trim: true,
        required: true
    }
})

module.exports = mongoose.model('Home5', Home5)