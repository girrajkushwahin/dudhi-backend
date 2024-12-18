const Home7 = require('../../models/homeSec/homeSec7')
const asyncHandler = require('express-async-handler')
const fs = require('fs')

const postHomeSec7 = asyncHandler(async (req, res) => {
    if (!req.body.text || !req.body.link || !req.file) return res.status(422).json({ message: 'Enter valid data' })
    else {
        const insert = await Home7.create({ text: req.body.text, link: req.body.link, image: req.file.path })
        if (insert) return res.status(201).json({ messsage: 'Data inserted' })
        else return res.status(500).json({ message: 'Internal error' })
    }
})

const getHomeSec7 = asyncHandler(async (req, res) => {
    const status = await Home7.find()
    if (status) return res.status(201).json(status)
    else return res.status(422).json({ message: 'Internal error' })
})

const patchHomeSec7 = asyncHandler(async (req, res) => {
    if (req.query.id) {
        const result = await Home7.findOne({ _id: req.query.id })
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

        const update = await Home7.updateOne({ _id: req.query.id }, {
            $set: {
                text: req.body.text, link: req.body.link, image: newImgPath
            }
        })
        if (update) return res.status(201).json({ message: 'data updated' })
        else return res.status(500).json({ message: 'Internal error' })

    } else return res.status(422).json({ message: 'Enter valid id' })
})

module.exports = { postHomeSec7, getHomeSec7, patchHomeSec7 }