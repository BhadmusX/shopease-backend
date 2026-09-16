const  express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/verifyToken');
const {createcartItem, clearCart,getCartItems, updateCartQty, deleteCartItem} = require('../controllers/cartcontroller');

router.post('/cart/create', verifyToken, createcartItem);
router.get('/cart/get', verifyToken, getCartItems);
router.put('/cart/update/:id', verifyToken, updateCartQty);
router.delete('/cart/delete/:id', verifyToken, deleteCartItem);
router.delete('/cart/delete', verifyToken, clearCart);

module.exports = router;
