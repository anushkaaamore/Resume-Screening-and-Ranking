const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  getDashboard,
  getModelPerformance
} = require('../controllers/analyticsController');

const router = express.Router();

router.get('/dashboard', authenticateToken, getDashboard);
router.get('/model-performance', authenticateToken, getModelPerformance);

module.exports = router;
