const  express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/verifyToken');
const {createcartItem, getCartItems, updateCartQty, deleteCartItem} = require('../controllers/cartcontroller');

router.post('/cart/create', verifyToken, createcartItem);
router.get('/cart/get', verifyToken, getCartItems);
router.put('/cart/update', verifyToken, updateCartQty);
router.delete('/cart/delete', verifyToken, deleteCartItem);

module.exports = router;
