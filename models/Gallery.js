const mongoose = require('mongoose')

const gallerySchema = new mongoose.Schema({
    name: {
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

const Gallery = new mongoose.model('Gallery', gallerySchema)
module.exports = Gallery