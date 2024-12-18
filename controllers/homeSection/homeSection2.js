const Home2 = require('../../models/homeSec/homeSec2')
const asyncHandler = require('express-async-handler')

const postHomeSec2 = asyncHandler(async (req, res) => {
    if (!req.body.text) return res.status(422).json({ message: 'Enter valid data' })
    else {
        const insert = await Home2.create({ text: req.body.text })
        if (insert) return res.status(201).json({ messsage: 'Data inserted' })
        else return res.status(500).json({ message: 'Internal error' })
    }
})

const getHomeSec2 = asyncHandler(async (req, res) => {
    const status = await Home2.find()
    if (status) return res.status(201).json(status)
    else return res.status(422).json({ message: 'Internal error' })
})

const patchHomeSec2 = asyncHandler(async (req, res) => {
    if (req.query.id) {
        const update = await Home2.updateOne({ _id: req.query.id }, {
            $set: {
                text: req.body.text
            }
        })
        if (update) return res.status(201).json({ message: 'data updated' })
        else return res.status(500).json({ message: 'Internal error' })

    } else return res.status(422).json({ message: 'Enter valid id' })
})

module.exports = { postHomeSec2, getHomeSec2, patchHomeSec2 }