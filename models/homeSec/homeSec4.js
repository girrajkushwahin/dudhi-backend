const mongoose = require('mongoose')

const Home4 = new mongoose.Schema({
    text: {
        type: String,
        trim: true,
        required: true
    },
    paragraph: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: String,
        trim: true,
        required: true
    }
})

module.exports = mongoose.model('Home4', Home4)