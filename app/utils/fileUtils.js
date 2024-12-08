const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const uploadFile = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (isValidFile(file)) {
            cb(null, true); 
        } else {
            cb(null, false);
        }
    }
});

const isValidFile = (file) => {
    return file && ['image/jpg', 'image/jpeg', 'image/png'].includes(file.mimetype);
};

module.exports = { uploadFile, isValidFile };