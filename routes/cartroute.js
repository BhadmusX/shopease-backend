const  express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/verifyToken');
const {createcartItem} = require('../controllers/cartcontroller');

router.post('/cart/create', verifyToken, createcartItem);

module.exports = router;