const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../middlewares/authMiddleware');
const { getBalance, topUp, addTransaction, getTransactionHistory } = require('../controllers/transactionController');

router.use(verifyAuth); // Protect the routes

router.get('/balance', getBalance);
router.post('/topup', topUp);
router.post('/transaction', addTransaction);
router.get('/transaction/history', getTransactionHistory);

module.exports = router;
