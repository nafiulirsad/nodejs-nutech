const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../middlewares/authMiddleware');
const { uploadFile } = require('../utils/fileUtils');
const { registration, login, profile, updateProfile, updateProfileImage } = require('../controllers/membershipController');

router.post('/registration', registration);
router.post('/login', login);
router.get('/profile', verifyAuth, profile);
router.put('/profile/update', verifyAuth, updateProfile);
router.put('/profile/image', verifyAuth, uploadFile.single('file'), updateProfileImage);

module.exports = router;
