const express = require('express');
const router = express.Router();
const { createTransaction, getAllTransactions, getTransactionById, updateTransaction, deleteTransaction } = require('../controllers/transactionController');

// CRUD Routes
router.post('/create', createTransaction);
router.get('/list', getAllTransactions);
router.put('/update/:id', updateTransaction);
router.delete('/delete/:id', deleteTransaction);
router.get('/show/:id', getTransactionById);

module.exports = router;
