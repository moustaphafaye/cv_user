const express = require('express');
const router = express.Router();
// const { createUser, addFormation } = require('../controllers/userController');

const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');


router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.me);


module.exports = router;
