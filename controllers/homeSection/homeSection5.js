const Home5 = require('../../models/homeSec/homeSec5')
const asyncHandler = require('express-async-handler')
const fs = require('fs')

const postHomeSec5 = asyncHandler(async (req, res) => {
    const { heading, paragraph } = req.body
    if (!heading || !paragraph || !req.file) return res.status(422).json({ message: 'Enter valid data' })
    else {
        const insert = await Home5.create({ heading, paragraph, image: req.file.path })
        if (insert) return res.status(201).json({ messsage: 'Data inserted' })
        else return res.status(500).json({ message: 'Internal error' })
    }
})

const getHomeSec5 = asyncHandler(async (req, res) => {
    const status = await Home5.find()
    if (status) return res.status(201).json(status)
    else return res.status(422).json({ message: 'Internal error' })
})

const patchHomeSec5 = asyncHandler(async (req, res) => {
    if (req.query.id) {
        const { heading, paragraph } = req.body
        const result = await Home5.findOne({ _id: req.query.id })
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

        const update = await Home5.updateOne({ _id: req.query.id }, {
            $set: {
                heading, paragraph, image: newImgPath
            }
        })
        if (update) return res.status(201).json({ message: 'data updated' })
        else return res.status(500).json({ message: 'Internal error' })

    } else return res.status(422).json({ message: 'Enter valid id' })
})

module.exports = { postHomeSec5, getHomeSec5, patchHomeSec5 }