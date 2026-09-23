const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/verifyToken');
const {isAdmin} = require('../middlewares/isAdmin');
const {createProduct,getProducts, getProductById, deleteProductById, updateProductById, getCombinedProducts, toggleFeaturedProduct, getFeaturedProducts} = require('../controllers/productcontroller');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, './uploads/')
   },
   filename: function (req, file, cb) {
     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
     cb(null, file.fieldname + '-' + uniqueSuffix+path.extname(file.originalname))
   }
 })
 
 const upload = multer({ storage: storage })
//Static routes
router.post('/product/create', verifyToken, isAdmin, upload.single('imageUrl'), createProduct);
router.get('/product/combined/get', verifyToken, getCombinedProducts);
router.get('/product/get/featured', getFeaturedProducts);
router.get('/product/get', verifyToken, getProducts);

//Dynamic routes
router.get('/product/get/:id', verifyToken, getProductById);
router.delete('/product/delete/:id', verifyToken, isAdmin, deleteProductById);
router.put('/product/update/:id', verifyToken, isAdmin, upload.single('imageUrl'), updateProductById);
router.put('/product/togglefeature/:id', verifyToken, isAdmin,  toggleFeaturedProduct);
module.exports = router;