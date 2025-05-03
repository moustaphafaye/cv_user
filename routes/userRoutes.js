const express = require('express');
const multer = require('multer'); 
const router = express.Router();
// const { createUser, addFormation } = require('../controllers/userController');
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');
const upload = require('../middlewares/multer-config');
// router.post('/create', userController.createUser);
router.post(
    '/create',
    upload.fields([
      { name: 'photo_profi', maxCount: 1 },
      { name: 'cv', maxCount: 1 },
      { name: 'certification', maxCount: 1 },
    ]) ,
    userController.createUser
  );

router.get('/clients', authenticate ,userController.listClients);
router.delete('/delete/:id', authenticate ,userController.deleteUser);
router.get('/prestataires',userController.listPrestataires);
router.get('/prestataires/recherche/:id/:localocation', userController.recherchePrestataires);
router.get('/me/photo/:id', authenticate, userController.getUserPhoto);






module.exports = router;
