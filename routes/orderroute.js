const express = require("express");
const router = express.Router();
const {isAdmin} = require('../middlewares/isAdmin');
const {verifyToken} = require('../middlewares/verifyToken');
const {getOrders, getUserOrders, updateOrderStatus} = require('../controllers/orderController');

router.get('/orders/user/get', verifyToken, getUserOrders);
router.get('/orders/get', verifyToken, isAdmin, getOrders);

router.put("/orders/update/:id", verifyToken, isAdmin, updateOrderStatus);
module.exports = router;