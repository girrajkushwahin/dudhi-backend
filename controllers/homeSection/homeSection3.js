const Home3 = require('../../models/homeSec/homeSec3')
const asyncHandler = require('express-async-handler')
const fs = require('fs')

const postHomeSec3 = asyncHandler(async (req, res) => {
    const { heading, paragraph } = req.body
    if (!heading || !paragraph || !req.files) return res.status(422).json({ message: 'Enter valid data' })
    else {
        let arrayData = req.files.map(elem => elem.path)
        const [image1, image2, image3] = arrayData
        const insert = await Home3.create({ heading, paragraph, image1, image2, image3 })
        if (insert) return res.status(201).json({ messsage: 'Data inserted' })
        else return res.status(500).json({ message: 'Internal error' })
    }
})

const getHomeSec3 = asyncHandler(async (req, res) => {
    const status = await Home3.find()
    if (status) return res.status(201).json(status)
    else return res.status(422).json({ message: 'Internal error' })
})

const patchHomeSec3 = asyncHandler(async (req, res) => {
    if (req.query.id) {
        const { heading, paragraph } = req.body
        const result = await Home3.findOne({ _id: req.query.id })
        const imgPath1 = result.image1
        const imgPath2 = result.image2
        const imgPath3 = result.image3
        let newImgPath1
        let newImgPath2
        let newImgPath3

        if (!req.files[0]) {
            newImgPath1 = imgPath1
            newImgPath2 = imgPath2
            newImgPath3 = imgPath3
        } else {
            if (req.files.length != 3) return res.status(422).json({ message: 'Enter all images' })
            else {
                if (imgPath1) {
                    fs.unlink(imgPath1, err => {
                        if (err) return
                    })
                }
                if (imgPath2) {
                    fs.unlink(imgPath2, err => {
                        if (err) return
                    })
                }
                if (imgPath3) {
                    fs.unlink(imgPath3, err => {
                        if (err) return
                    })
                }
                let arrayData = req.files.map(elem => elem.path)
                const [path1, path2, path3] = arrayData
                newImgPath1 = path1
                newImgPath2 = path2
                newImgPath3 = path3
            }
        }

        const update = await Home3.updateOne({ _id: req.query.id }, {
            $set: {
                heading, paragraph, image1: newImgPath1, image2: newImgPath2, image3: newImgPath3
            }
        })
        if (update) return res.status(201).json({ message: 'data updated' })
        else return res.status(500).json({ message: 'Internal error' })

    } else return res.status(422).json({ message: 'Enter valid id' })
})

module.exports = { postHomeSec3, getHomeSec3, patchHomeSec3 }