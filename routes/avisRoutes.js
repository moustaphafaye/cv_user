const express = require('express');
const router = express.Router();
// const { createUser, addFormation } = require('../controllers/userController');

const{ createAvis ,listAvis, getAvisById , updateAvis }= require('../controllers/avisController');
const { authenticate } = require('../middlewares/auth');


router.post('/create',authenticate , createAvis);
router.get('/list' , listAvis);
router.put('/update/:id' ,authenticate , updateAvis);
router.get('/delete/:id' , listAvis);
router.get('/show/:id' , getAvisById);



module.exports = router;