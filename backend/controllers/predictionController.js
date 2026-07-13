const PredictionService = require('../services/predictionService');
const PredictionHistoryModel = require('../models/predictionHistoryModel');
const CandidateModel = require('../models/candidateModel');
const { logInfo, logError } = require('../utils/logger');

function normalizePredictionResponse(data) {
  return {
    prediction: data.prediction,
    probability: data.probability,
    modelName: data.model_name || data.modelName || 'best_model',
    modelVersion: data.model_version || data.modelVersion || '1.0.0',
    featureImportance: data.feature_importance || data.featureImportance || [],
    reasons: data.reasons || []
  };
}

async function predictCandidate(req, res) {
  try {
    const recruiterId = req.user?.id || req.body.recruiterId;
    const candidateId = req.body.candidateId || null;

    if (!recruiterId) {
      return res.status(400).json({
        success: false,
        message: 'Recruiter ID is required for prediction'
      });
    }

    let candidateRecord = candidateId ? await CandidateModel.findById(candidateId) : null;

    if (!candidateRecord) {
      const createdCandidateId = await CandidateModel.create({
        recruiterId,
        candidateName: req.body.candidateName,
        age: Number(req.body.age || 0),
        gender: req.body.gender,
        degree: req.body.degree,
        branch: req.body.branch,
        collegeTier: req.body.collegeTier,
        cgpa: req.body.cgpa,
        programmingLanguages: Number(req.body.programmingLanguages || 0),
        skillsCount: Number(req.body.skillsCount || 0),
        projectsCount: Number(req.body.projectsCount || 0),
        internshipCount: Number(req.body.internshipCount || 0),
        certificationCount: Number(req.body.certificationCount || 0),
        hackathonCount: Number(req.body.hackathonCount || 0),
        codingScore: req.body.codingScore,
        communicationScore: req.body.communicationScore,
        leadershipScore: req.body.leadershipScore,
        experienceYears: req.body.experienceYears,
        shortlistedLabel: Number(req.body.shortlistedLabel || 0)
      });

      candidateRecord = await CandidateModel.findById(createdCandidateId);
    }

    const featurePayload = candidateRecord || req.body;
    const predictionResult = await PredictionService.predict(featurePayload);
    const normalizedResult = normalizePredictionResponse(predictionResult);

    const historyId = await PredictionHistoryModel.create({
      candidateId: candidateRecord.id,
      recruiterId,
      predictedLabel: normalizedResult.prediction === 'Shortlisted' || normalizedResult.prediction === 1,
      probability: normalizedResult.probability,
      modelName: normalizedResult.modelName,
      modelVersion: normalizedResult.modelVersion,
      featureSnapshot: featurePayload
    });

    logInfo('Prediction completed successfully', {
      recruiterId,
      candidateId,
      historyId,
      modelName: normalizedResult.modelName
    });

    return res.status(200).json({
      success: true,
      message: 'Prediction completed successfully',
      data: {
        historyId,
        candidate: candidateRecord,
        ...normalizedResult
      }
    });
  } catch (error) {
    logError('Prediction request failed', { message: error.message });
    return res.status(500).json({
      success: false,
      message: 'Failed to generate prediction'
    });
  }
}

async function getPredictionHistory(req, res) {
  try {
    const recruiterId = req.user?.id ? Number(req.query.recruiterId || req.user.id) : req.query.recruiterId;
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.max(1, Math.min(100, Number(req.query.limit || 20)));
    const offset = (page - 1) * limit;

    const [items, total] = await Promise.all([
      PredictionHistoryModel.findAll({ recruiterId, limit, offset }),
      PredictionHistoryModel.count({ recruiterId })
    ]);

    return res.status(200).json({
      success: true,
      message: 'Prediction history retrieved successfully',
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    });
  } catch (error) {
    logError('Get prediction history failed', { message: error.message });
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve prediction history'
    });
  }
}

module.exports = {
  predictCandidate,
  getPredictionHistory
};
