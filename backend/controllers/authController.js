const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const RecruiterModel = require('../models/recruiterModel');
const { logInfo, logWarn, logError } = require('../utils/logger');

function buildTokenPayload(recruiter) {
  return {
    id: recruiter.id,
    email: recruiter.email,
    role: recruiter.role
  };
}

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
}

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    const existingRecruiter = await RecruiterModel.findByEmail(email);
    if (existingRecruiter) {
      logWarn('Registration attempted with existing email', { email });
      return res.status(409).json({
        success: false,
        message: 'A recruiter with this email already exists'
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const recruiterId = await RecruiterModel.create({
      name,
      email,
      passwordHash,
      role
    });

    const recruiter = await RecruiterModel.findById(recruiterId);
    const token = signToken(buildTokenPayload(recruiter));

    logInfo('Recruiter registered successfully', { recruiterId, email });

    return res.status(201).json({
      success: true,
      message: 'Recruiter registered successfully',
      data: {
        recruiter,
        token
      }
    });
  } catch (error) {
    logError('Register request failed', { message: error.message });
    return res.status(500).json({
      success: false,
      message: 'Failed to register recruiter'
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const recruiter = await RecruiterModel.findByEmail(email);
    if (!recruiter) {
      logWarn('Login failed for unknown email', { email });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, recruiter.passwordHash);
    if (!isPasswordValid) {
      logWarn('Login failed due to invalid password', { email });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = signToken(buildTokenPayload(recruiter));

    logInfo('Recruiter logged in successfully', { recruiterId: recruiter.id, email });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        recruiter: {
          id: recruiter.id,
          name: recruiter.name,
          email: recruiter.email,
          role: recruiter.role,
          createdAt: recruiter.createdAt,
          updatedAt: recruiter.updatedAt
        },
        token
      }
    });
  } catch (error) {
    logError('Login request failed', { message: error.message });
    return res.status(500).json({
      success: false,
      message: 'Failed to login recruiter'
    });
  }
}

module.exports = {
  register,
  login
};
