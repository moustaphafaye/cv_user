const express = require('express');
const router = express.Router();
// const { createUser, addFormation } = require('../controllers/userController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');


// const userValidationRules = require('../validators/userValidator');
// const {
//     validateCreateUser,
//     validateFormation,
//     validateExperience,
//     validateLangue,
//     validateCompetence,
//     validateLoisir
// } = require('../validators/userValidator');
// const validateRequest = require('../middlewares/validateRequest');


router.post('/create', userController.createUser);
router.get('/clients', authenticate ,userController.listClients);
router.get('/prestataires',userController.listPrestataires);
router.get('/prestataires/recherche/:id/:localocation', userController.recherchePrestataires);






module.exports = router;
