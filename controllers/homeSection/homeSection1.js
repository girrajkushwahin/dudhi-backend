const Home1 = require('../../models/homeSec/homeSec1')
const asyncHandler = require('express-async-handler')
const fs = require('fs')

const postHomeSec1 = asyncHandler(async (req, res) => {
    const { heading, paragraph } = req.body
    if (!heading || !paragraph || !req.file) return res.status(422).json({ message: 'Enter valid data' })
    else {
        const insert = await Home1.create({ heading, paragraph, video: req.file.path })
        if (insert) return res.status(201).json({ messsage: 'Data inserted' })
        else return res.status(500).json({ message: 'Internal error' })
    }
})

const getHomeSec1 = asyncHandler(async (req, res) => {
    const status = await Home1.find()
    if (status) return res.status(201).json(status)
    else return res.status(422).json({ message: 'Internal error' })
})

const patchHomeSec1 = asyncHandler(async (req, res) => {
    const { heading, paragraph } = req.body
    if (req.query.id) {
        const result = await Home1.findOne({ _id: req.query.id })
        const imgPath = result.video
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

        const update = await Home1.updateOne({ _id: req.query.id }, {
            $set: {
                heading, paragraph, video: newImgPath
            }
        })
        if (update) return res.status(201).json({ message: 'data updated' })
        else return res.status(500).json({ message: 'Internal error' })

    } else return res.status(422).json({ message: 'Enter valid id' })
})

module.exports = { postHomeSec1, getHomeSec1, patchHomeSec1 }