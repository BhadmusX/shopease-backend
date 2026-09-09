const express = require('express');
const router = express.Router();
const {createCheckoutSession, checkOutSuccess} = require('../controllers/paymentcontroller');
const { verifyToken } = require('../middlewares/verifyToken');

router.post('/payement/checkoutsession', verifyToken, createCheckoutSession);
router.post('/payment/success', verifyToken, checkOutSuccess);

module.exports = router;