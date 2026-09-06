const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/verifyToken');
const {createProduct} = require('../controllers/productcontroller');
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

router.post('/product/create', verifyToken, upload.single('imageUrl'), createProduct)
module.exports = router;