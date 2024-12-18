const Home4 = require('../../models/homeSec/homeSec4')
const asyncHandler = require('express-async-handler')
const fs = require('fs')

const postHomeSec4 = asyncHandler(async (req, res) => {
    const { text, paragraph } = req.body
    if (!text || !paragraph || !req.file) return res.status(422).json({ message: 'Enter valid data' })
    else {
        const insert = await Home4.create({ text, paragraph, image: req.file.path })
        if (insert) return res.status(201).json({ messsage: 'Data inserted' })
        else return res.status(500).json({ message: 'Internal error' })
    }
})

const getHomeSec4 = asyncHandler(async (req, res) => {
    const status = await Home4.find()
    if (status) return res.status(201).json(status)
    else return res.status(422).json({ message: 'Internal error' })
})

const patchHomeSec4 = asyncHandler(async (req, res) => {
    if (req.query.id) {
        const { text, paragraph } = req.body
        const result = await Home4.findOne({ _id: req.query.id })
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

        const update = await Home4.updateOne({ _id: req.query.id }, {
            $set: {
                text, paragraph, image: newImgPath
            }
        })
        if (update) return res.status(201).json({ message: 'data updated' })
        else return res.status(500).json({ message: 'Internal error' })

    } else return res.status(422).json({ message: 'Enter valid id' })
})

module.exports = { postHomeSec4, getHomeSec4, patchHomeSec4 }