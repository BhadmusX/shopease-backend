const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/verifyToken');
const {createFavorite, deleteFavorite, getFavorites} = require('../controllers/favoritecontroller');

router.post('/favorite/create', verifyToken, createFavorite);
router.delete('/favorite/delete', verifyToken, deleteFavorite);
router.get('/favorite/get', verifyToken, getFavorites);

module.exports = router;
