const express = require('express');
const router = express.Router();
// const { createUser, addFormation } = require('../controllers/userController');
const serviceController = require('../controllers/serviceController');


// Routes Service
router.post('/create', serviceController.createService);
router.get('/list', serviceController.listServices);
router.put('/update/:id',  serviceController.updateService);
router.delete('/delete/:id',  serviceController.deleteService);
router.get('/show/:id', serviceController.showService);




module.exports = router;
