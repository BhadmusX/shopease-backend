const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/verifyToken');
const {createFavorite} = require('../controllers/favoritecontroller');

router.post('/favorite/create', verifyToken, createFavorite);

module.exports = router;
