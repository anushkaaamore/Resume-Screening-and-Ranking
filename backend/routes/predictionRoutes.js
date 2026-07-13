const express = require('express');
const { body, query } = require('express-validator');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  predictCandidate,
  getPredictionHistory
} = require('../controllers/predictionController');

const router = express.Router();

const predictionValidation = [
  body('candidateId').optional().isInt({ min: 1 }).withMessage('Candidate id must be a positive integer'),
  body('candidateName').optional().trim().notEmpty().withMessage('Candidate name cannot be empty when provided'),
  body('age').optional().isInt({ min: 0 }).withMessage('Age must be valid when provided'),
  body('cgpa').optional().isFloat({ min: 0, max: 10 }).withMessage('CGPA must be between 0 and 10 when provided')
];

router.post('/', authenticateToken, predictionValidation, predictCandidate);
router.get(
  '/history',
  authenticateToken,
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
  ],
  getPredictionHistory
);

module.exports = router;
