const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyToken');
const { isAdmin } = require('../middlewares/isAdmin');
const {getAnalyticsData} = require("../controllers/analyticscontroller");

router.get('/analytics/get', verifyToken, isAdmin, getAnalyticsData);

module.exports = router;
