const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    heading: {
        type: String,
        trim: true,
        required: true
    },
    date: {
        type: String,
        trim: true,
        required: true
    },
    readmore: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: String,
        trim: true,
        required: true
    },
    paragraph: {
        type: String,
        trim: true,
        required: true
    },
    blogData: [
        {
            head: {
                type: String,
                trim: true,
                required: true
            },
            para: {
                type: String,
                trim: true,
                required: true
            }
        }
    ]
})

const Blog = new mongoose.model('blog', blogSchema)
module.exports = Blog