const multer = require("multer");

const storage = (folder) => multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `documents/${folder}/`); // Use the provided folder parameter in the destination path
  },
  filename: (req, file, cb) => {
    let ext = file.originalname;
    cb(null, Date.now() + "-" + ext);
  },
});

exports.upload = (folder) => multer({
  storage: storage(folder),
  fileFilter: function (req, file, callback) {
    callback(null, true);
  }
})