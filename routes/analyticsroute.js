const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyToken');
const { isAdmin } = require('../middlewares/isAdmin');
const {getAnalyticsData, getDailySales} = require("../controllers/analyticscontroller");

router.get('/analytics/get', verifyToken, isAdmin, getAnalyticsData);
router.get('/analytics/get/dailysales', verifyToken, isAdmin, getDailySales);

module.exports = router;
