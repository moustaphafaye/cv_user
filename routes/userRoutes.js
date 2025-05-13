const express = require('express');
const multer = require('multer');
const router = express.Router();
// const { createUser, addFormation } = require('../controllers/userController');
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');
const upload = require('../middlewares/multer-config');
// router.post('/create', userController.createUser);
router.post('/create', upload.fields([
  { name: 'photo_profi', maxCount: 1 },
  { name: 'cv', maxCount: 1 },
  { name: 'certification', maxCount: 1 },
]),
  userController.createUser
);
router.get('/clients', authenticate, userController.listClients);
router.delete('/delete/:id', authenticate, userController.deleteUser);
router.get('/prestataires', userController.listPrestataires);
router.get('/show/:id', authenticate, userController.getUserDetails);
router.get('/prestataires/recherche/:id/:localocation', userController.recherchePrestataires);
router.get('/me/photo', authenticate, userController.getUserPhoto);
router.get('/cv/prestataire/:id', authenticate, userController.getUserCv);
router.get('/certification/prestataire/:id', authenticate, userController.getUserCertification);
// router.patch('/update/:id/cv', userController.updateCV );

router.put('/update/:id/file', upload.fields([{ name: 'cv', maxCount: 1 },{ name: 'certification', maxCount: 1 }, { name: 'photo_profi', maxCount: 1 }]), userController.updateDocument);
// router.get('/users/:id/photo', authenticate, userController.getUserPhoto);

module.exports = router;
