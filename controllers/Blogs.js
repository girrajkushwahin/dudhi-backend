const Blog = require('../models/Blogs')
const fs = require("fs")

exports.createBlog = async (req, res) => {
    try {
        const { heading, date, readmore, paragraph, blogData } = req.body
        if (!req.file || !heading || !date || !readmore || !paragraph || !blogData) return res.status(422).json({ message: 'Enter valid data' })
        else {
            const blogInfo = JSON.parse(blogData)
            const status = await Blog.create({ heading, date, readmore, paragraph, blogData: blogInfo, image: req.file.path })
            if (status) return res.status(201).json({ message: 'Blog added' })
            else return res.status(500).json({ message: 'Internal error' })
        }
    } catch (err) {
        console.log(err);
    }
}

exports.getBlog = async (req, res) => {
    try {
        const result = await Blog.find({})
        if (result) return res.status(201).json(result)
        else return res.status(500).json({ message: 'Internal error' })
    } catch (err) {
        console.log(err);
    }
}

exports.getBlogById = async (req, res) => {
    try {
        const result = await Blog.findOne({ _id: req.params.id })
        if (result) return res.status(201).json(result)
        else return res.status(500).json({ message: 'Internal error' })
    } catch (err) {
        console.log(err);
    }
}

exports.updateBlog = async (req, res) => {
    try {
        if (req.params.id) {
            const { heading, date, readmore, paragraph } = req.body
            const result = await Blog.findOne({ _id: req.params.id })
            if (!result) return res.status(422).json({ success: 'false', message: 'Invalid Id' })
            else {
                const ximage = result.image
                let image

                if (!req.file) {
                    image = ximage
                } else {
                    fs.unlink(ximage, err => {
                        if (err) return
                    })
                    image = req.file.path
                }

                const status = await Blog.updateOne({ _id: req.params.id }, {
                    $set: { heading, date, readmore, paragraph, image }
                })

                if (status) return res.status(201).json({ success: 'true', message: 'Blog updated' })
                else return res.status(500).json({ success: 'false', message: 'Internal error' })
            }
        }
    } catch (err) {
        console.log(err);
    }
}

exports.deleteBlog = async (req, res) => {
    try {
        const result = await Blog.findOne({ _id: req.params.id })
        if (!result) return res.status(422).json({ success: 'false', message: 'Invalid Id' })
        else {
            const image = result.image
            fs.unlink(image, err => {
                if (err) return
            })

            const status = await Blog.deleteOne({ _id: req.params.id })
            if (status) return res.status(201).json({ success: 'true', message: 'Blog deleted' })
            else return res.status(500).json({ success: 'false', message: 'Internal error' })
        }
    } catch (err) {
        console.log(err);
    }
}