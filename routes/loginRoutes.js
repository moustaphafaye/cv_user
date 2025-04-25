const express = require('express');
const router = express.Router();
// const { createUser, addFormation } = require('../controllers/userController');

const authController = require('../controllers/authController');

router.post('/login', authController.login);


module.exports = router;
