const express = require('express');
const multer = require('multer'); 
const router = express.Router();
// const { createUser, addFormation } = require('../controllers/userController');
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');


router.post('/create', userController.createUser);

router.get('/clients', authenticate ,userController.listClients);
router.get('/prestataires',userController.listPrestataires);
router.get('/prestataires/recherche/:id/:localocation', userController.recherchePrestataires);






module.exports = router;
