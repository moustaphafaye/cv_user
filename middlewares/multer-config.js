const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDirs = ['uploads/photos', 'uploads/cv', 'uploads/certifications'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/others';
    if (file.fieldname === 'photo_profi') folder = 'uploads/photos';
    if (file.fieldname === 'cv') folder = 'uploads/cv';
    if (file.fieldname === 'certification') folder = 'uploads/certifications';
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split(' ').join('_');
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}_${name}`);
  }
});

const upload = multer({ storage });

module.exports = upload;


// middleware/multer.js
// const multer = require('multer');
// const path = require('path');

// // Définir le dossier de destination et nom de fichier
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // crée ce dossier si pas encore fait
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     const filename = `${Date.now()}-${file.fieldname}${ext}`;
//     cb(null, filename);
//   },
// });

// const upload = multer({
//   storage: storage,
// });

// module.exports = upload;
