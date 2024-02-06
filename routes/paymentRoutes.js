const express = require('express');
const { processPayment } = require('../controller/paymentController');
const router = express.Router();

router.post('/process-payment', processPayment)

module.exports = router;