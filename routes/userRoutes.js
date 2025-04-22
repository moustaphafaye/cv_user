const express = require('express');
const router = express.Router();
// const { createUser, addFormation } = require('../controllers/userController');
const userController = require('../controllers/userController');

// router.get('/users/search/:key', userController.searchUser);
router.get('/search/:key', userController.searchUser);
router.post('/users', userController.createUser);
router.patch('/users/:id/formation', userController.addFormation);
router.patch('/users/:id/experience', userController.addExperience);
// router.patch('/users/:id/formation', userController.addFormation);
router.patch('/users/:id/langue', userController.addLangue);
router.patch('/users/:id/competence', userController.addCompetence);
router.patch('/users/:id/loisir', userController.addLoisir);


module.exports = router;
