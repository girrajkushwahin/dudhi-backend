const express = require('express')
const app = express()
const router = express.Router()
const { upload } = require('../middlewares/multer')
const authenticate = require('../middlewares/authenticate')
const { postHomeSec1, getHomeSec1, patchHomeSec1 } = require('../controllers/homeSection/homeSection1')
const { postHomeSec2, getHomeSec2, patchHomeSec2 } = require('../controllers/homeSection/homeSection2')
const { postHomeSec3, getHomeSec3, patchHomeSec3 } = require('../controllers/homeSection/homeSection3')
const { postHomeSec4, getHomeSec4, patchHomeSec4 } = require('../controllers/homeSection/homeSection4')
const { postHomeSec5, getHomeSec5, patchHomeSec5 } = require('../controllers/homeSection/homeSection5')
const { postHomeSec7, getHomeSec7, patchHomeSec7 } = require('../controllers/homeSection/homeSection7')
const { postHomeSec8, getHomeSec8, patchHomeSec8, delHomeSec8 } = require('../controllers/homeSection/homeSection8')


router.post('/sec1', authenticate, upload('videos').single('video'), postHomeSec1).get('/sec1', getHomeSec1).patch('/sec1', authenticate, upload('videos').single('video'), patchHomeSec1)

// router.post('/sec2', upload('videos').single('image'), postHomeSec2).get('/sec2', getHomeSec2).patch('/sec2', upload('videos').single('image'), patchHomeSec2)

router.post('/sec2', authenticate, postHomeSec2).get('/sec2', getHomeSec2).patch('/sec2', authenticate, patchHomeSec2)

router.post('/sec3', authenticate, upload('photos').array('image', 3), postHomeSec3).get('/sec3', getHomeSec3).patch('/sec3', authenticate, upload('photos', 3).array('image', 3), patchHomeSec3)

router.post('/sec4', authenticate, upload('photos').single('image'), postHomeSec4).get('/sec4', getHomeSec4).patch('/sec4', authenticate, upload('photos').single('image'), patchHomeSec4)

router.post('/sec5', authenticate, upload('photos').single('image'), postHomeSec5).get('/sec5', getHomeSec5).patch('/sec5', authenticate, upload('photos').single('image'), patchHomeSec5)

router.post('/sec7', authenticate, upload('photos').single('image'), postHomeSec7).get('/sec7', getHomeSec7).patch('/sec7', authenticate, upload('photos').single('image'), patchHomeSec7)

router.post('/sec8', authenticate, upload('photos').single('image'), postHomeSec8).get('/sec8', getHomeSec8).patch('/sec8', authenticate, upload('photos').single('image'), patchHomeSec8).delete('/sec8', authenticate, delHomeSec8)


module.exports = router