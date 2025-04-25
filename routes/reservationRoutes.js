const express = require('express');
const router = express.Router();
// const { createUser, addFormation } = require('../controllers/userController');

const reservationController = require('../controllers/reservationController');


// Routes Réservation
router.post('/create', reservationController.createReservation);
router.get('/list', reservationController.getUserReservations);
router.put('/update/:id', reservationController.updateReservation);
router.delete('/delete/:id', reservationController.deleteReservation);
router.get('/show/:id', reservationController.showReservation);


module.exports = router;
