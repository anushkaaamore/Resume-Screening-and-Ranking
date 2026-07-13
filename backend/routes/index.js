const express = require('express');
const authRoutes = require('./authRoutes');
const candidateRoutes = require('./candidateRoutes');
const predictionRoutes = require('./predictionRoutes');
const analyticsRoutes = require('./analyticsRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/candidate', candidateRoutes);
router.use('/predict', predictionRoutes);
router.use('/', analyticsRoutes);

module.exports = router;
