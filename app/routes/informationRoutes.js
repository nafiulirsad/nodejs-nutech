const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../middlewares/authMiddleware');
const { getBanners, getServices } = require('../controllers/informationController');

router.get('/banner', getBanners);
router.get('/services', verifyAuth, getServices);

module.exports = router;
