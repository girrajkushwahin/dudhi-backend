const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const { upload } = require("../middlewares/multer");
const { getBlog, getBlogById, createBlog, updateBlog, deleteBlog } = require('../controllers/Blogs')


router.post('/blogs', authenticate, upload('photos').single('image'), createBlog)
router.get('/blogs', getBlog)
router.get('/blogs/:id', getBlogById)
router.patch('/blogs/:id', authenticate, upload('photos').single('image'), updateBlog)
router.delete('/blogs/:id', authenticate, deleteBlog)

module.exports = router;
