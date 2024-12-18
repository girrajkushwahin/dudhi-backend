const fs = require('fs')
const Gallery = require('../models/Gallery')

exports.postGallery = async (req, res) => {
    try {
        if (!req.body.name || !req.file) return res.status(422).json({ success: 'false', message: 'Enter valid data' })
        else {
            const status = await Gallery.create({ name: req.body.name, image: req.file.path })
            if (status) return res.status(201).json({ success: 'true', message: 'Data added' })
            else return res.status(500).json({ success: 'false', message: 'Internal error' })
        }
    } catch (err) {
        console.log(err);
    }
}

exports.getGallery = async (req, res) => {
    try {
        const result = await Gallery.find({})
        if (!result) return res.status(422).josn({ success: 'false', message: 'Data not found' })
        else return res.status(201).json(result)
    } catch (err) {
        console.log(err);
    }
}

exports.getGalleryById = async (req, res) => {
    try {
        if (req.params.id) {
            const result = await Gallery.findOne({ _id: req.params.id })
            if (result) return res.status(201).json(result)
            else return res.status(422).json({ success: 'false', message: 'Data not found' })
        }
    } catch (err) {
        console.log(err);
    }
}

exports.patchGallery = async (req, res) => {
    try {
        if (req.params.id) {
            const result = await Gallery.findOne({ _id: req.params.id })
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

                const status = await Gallery.updateOne({ _id: req.params.id }, {
                    $set: { name: req.body.name, image }
                })

                if (status) return res.status(201).json({ success: 'true', message: 'Data updated' })
                else return res.status(500).json({ success: 'false', message: 'Internal error' })
            }
        }
    } catch (err) {
        console.log(err);
    }
}

exports.deleteGallery = async (req, res) => {
    try {
        if (req.params.id) {
            const result = await Gallery.findOne({ _id: req.params.id })
            if (!result) return res.status(422).json({ success: 'false', message: 'Invalid Id' })
            else {
                fs.unlink(result.image, err => {
                    if (err) return
                })

                const status = await Gallery.deleteOne({ _id: req.params.id })
                if (status) return res.status(201).json({ success: 'true', message: 'Data deleted' })
                else return res.status(500).json({ success: 'false', message: 'Internal error' })
            }
        }
    } catch (err) {
        console.log(err);
    }
}