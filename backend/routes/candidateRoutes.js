const express = require('express');
const { body, param, query } = require('express-validator');
const {
  createCandidate,
  getCandidates,
  updateCandidate,
  deleteCandidate
} = require('../controllers/candidateController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

const candidateValidation = [
  body('candidateName').trim().notEmpty().withMessage('Candidate name is required'),
  body('age').isInt({ min: 0 }).withMessage('Age must be a non-negative integer'),
  body('gender').trim().notEmpty().withMessage('Gender is required'),
  body('degree').trim().notEmpty().withMessage('Degree is required'),
  body('branch').trim().notEmpty().withMessage('Branch is required'),
  body('collegeTier').trim().notEmpty().withMessage('College tier is required'),
  body('cgpa').isFloat({ min: 0, max: 10 }).withMessage('CGPA must be between 0 and 10'),
  body('codingScore').isFloat({ min: 0, max: 100 }).withMessage('Coding score must be between 0 and 100'),
  body('communicationScore').isFloat({ min: 0, max: 100 }).withMessage('Communication score must be between 0 and 100'),
  body('leadershipScore').isFloat({ min: 0, max: 100 }).withMessage('Leadership score must be between 0 and 100'),
  body('experienceYears').isFloat({ min: 0 }).withMessage('Experience years must be non-negative')
];

router.post('/', authenticateToken, candidateValidation, createCandidate);
router.get(
  '/',
  authenticateToken,
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
  ],
  getCandidates
);
router.put('/:id', authenticateToken, [param('id').isInt({ min: 1 }).withMessage('Candidate id must be valid')], updateCandidate);
router.delete('/:id', authenticateToken, [param('id').isInt({ min: 1 }).withMessage('Candidate id must be valid')], deleteCandidate);

module.exports = router;
