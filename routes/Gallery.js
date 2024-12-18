const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const { upload } = require("../middlewares/multer");
const { postGallery, getGallery, getGalleryById, patchGallery, deleteGallery } = require('../controllers/gallery')

router.post('/gallery', authenticate, upload('gallery').single('image'), postGallery)
router.get('/gallery', getGallery)
router.get('/gallery/:id', getGalleryById)
router.patch('/gallery/:id', authenticate, upload('gallery').single('image'), patchGallery)
router.delete('/gallery/:id', authenticate, deleteGallery)

module.exports = router;
