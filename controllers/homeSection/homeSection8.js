const Home8 = require('../../models/homeSec/homeSec8')
const asyncHandler = require('express-async-handler')
const fs = require('fs')

const postHomeSec8 = asyncHandler(async (req, res) => {
    const { name, post, heading, paragraph } = req.body
    if (!name || !post || !heading || !paragraph || !req.file) return res.status(422).json({ message: 'Enter valid data' })
    else {
        const insert = await Home8.create({ name, post, heading, paragraph, image: req.file.path })
        if (insert) return res.status(201).json({ messsage: 'Data inserted' })
        else return res.status(500).json({ message: 'Internal error' })
    }
})

const getHomeSec8 = asyncHandler(async (req, res) => {
    const status = await Home8.find()
    if (status) return res.status(201).json(status)
    else return res.status(422).json({ message: 'Internal error' })
})

const patchHomeSec8 = asyncHandler(async (req, res) => {
    if (req.query.id) {
        const { name, post, heading, paragraph } = req.body
        const result = await Home8.findOne({ _id: req.query.id })
        const imgPath = result.image
        let newImgPath

        if (!req.file) {
            newImgPath = imgPath
        } else {
            if (imgPath) {
                fs.unlink(imgPath, err => {
                    if (err) return
                })
            }
            newImgPath = req.file.path
        }

        const update = await Home8.updateOne({ _id: req.query.id }, {
            $set: {
                name, post, heading, paragraph, image: newImgPath
            }
        })
        if (update) return res.status(201).json({ message: 'data updated' })
        else return res.status(500).json({ message: 'Internal error' })

    } else return res.status(422).json({ message: 'Enter valid id' })
})

const delHomeSec8 = asyncHandler(async (req, res) => {
    if (req.query.id) {
        const result = await Home8.findOne({ _id: req.query.id })
        if (!result) return res.status(404).json({ message: 'ID not found' })
        else {
            const image = result.image
            if (image) {
                fs.unlink(image, err => {
                    if (err) return
                })
            }
            const status = await Home8.deleteOne({ _id: req.query.id })
            if (status) return res.status(201).json({ message: 'data deleted' })
            else return res.status(422).json({ message: 'Internal error' })
        }
    }
})

module.exports = { postHomeSec8, getHomeSec8, patchHomeSec8, delHomeSec8 }