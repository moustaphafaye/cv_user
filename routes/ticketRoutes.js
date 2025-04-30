const express = require('express');
const router = express.Router();
// const { createUser, addFormation } = require('../controllers/userController');

const { createTicket, getAllTickets, getTicketById, updateTicket, deleteTicket } = require('../controllers/ticketController');
const { authenticate } = require('../middlewares/auth');


router.post('/create',authenticate , createTicket);
router.get('/list' , authenticate , getAllTickets);
router.put('/update/:id' , authenticate  , updateTicket);
router.get('/delete/:id' ,  authenticate ,deleteTicket);
router.get('/show/:id' , authenticate , getTicketById);





module.exports = router;