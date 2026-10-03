const express = require("express");
const router = express.Router();
const {isAdmin} = require('../middlewares/isAdmin');
const {verifyToken} = require('../middlewares/verifyToken');
const {getOrders, getUserOrders} = require('../controllers/orderController');

router.get('/orders/user/get', verifyToken, getUserOrders);
router.get('/orders/get', verifyToken, isAdmin, getOrders);
module.exports = router;