const multer = require('multer');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

const storage = multer.diskStorage({
  // where to save the images
  destination: async (req, file, callback) => {
    if (!fs.existsSync(path.join(__dirname, '..', 'images'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'images'));
    }
    callback(null, 'images');
  },

  // what to name the images
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  },
});

module.exports = multer({ storage: storage }).single('image');
