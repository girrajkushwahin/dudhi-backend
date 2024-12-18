const multer = require("multer");

const upload2 = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `documents/photos`)
        },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`)
        }
    })
})

module.exports = upload2;
