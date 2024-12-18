const mongoose = require('mongoose')

const Home2 = new mongoose.Schema({
    text: {
        type: String,
        trim: true,
        required: true
    }
})

module.exports = mongoose.model('Home2', Home2)