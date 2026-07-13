const { pool } = require('../config/db');
const ModelInformationModel = require('../models/modelInformationModel');
const PredictionService = require('../services/predictionService');
const { logError } = require('../utils/logger');

async function getDashboard(req, res) {
  try {
    const recruiterId = req.user?.id || req.query.recruiterId || null;

    const candidateFilter = recruiterId ? 'WHERE recruiter_id = ?' : '';
    const predictionFilter = recruiterId ? 'WHERE recruiter_id = ?' : '';

    const candidateParams = recruiterId ? [recruiterId] : [];
    const predictionParams = recruiterId ? [recruiterId] : [];

    const [candidateCountRows, shortlistedRows, predictionCountRows, modelRows] = await Promise.all([
      pool.execute(`SELECT COUNT(*) AS total FROM candidates ${candidateFilter}`, candidateParams),
      pool.execute(`SELECT COUNT(*) AS total FROM candidates ${candidateFilter}${candidateFilter ? ' AND' : ' WHERE'} shortlisted_label = 1`, candidateParams),
      pool.execute(`SELECT COUNT(*) AS total FROM prediction_history ${predictionFilter}`, predictionParams),
      ModelInformationModel.getAll()
    ]);

    const totalCandidates = candidateCountRows[0][0]?.total || 0;
    const shortlistedCandidates = shortlistedRows[0][0]?.total || 0;
    const totalPredictions = predictionCountRows[0][0]?.total || 0;

    return res.status(200).json({
      success: true,
      message: 'Dashboard metrics retrieved successfully',
      data: {
        summary: {
          totalCandidates,
          shortlistedCandidates,
          totalPredictions,
          shortlistRate: totalCandidates ? shortlistedCandidates / totalCandidates : 0
        },
        models: modelRows
      }
    });
  } catch (error) {
    logError('Dashboard analytics failed', { message: error.message });
    return res.status(500).json({
      success: false,
      message: 'Failed to load dashboard metrics'
    });
  }
}

async function getModelPerformance(req, res) {
  try {
    const [databaseModels, liveModelPayload] = await Promise.all([
      ModelInformationModel.getAll(),
      PredictionService.getModelPerformance().catch(() => null)
    ]);

    const liveModelResults = liveModelPayload?.data?.modelResults || {};
    const liveBestModelName = liveModelPayload?.data?.modelName;

    const models = Object.keys(liveModelResults).length
      ? Object.entries(liveModelResults).map(([modelName, metrics]) => ({
          modelName,
          modelType: 'classification',
          accuracy: metrics.test_accuracy || 0,
          precisionScore: metrics.test_precision || 0,
          recallScore: metrics.test_recall || 0,
          f1Score: metrics.test_f1 || 0,
          rocAuc: metrics.test_roc_auc || 0,
          crossValidationScore: metrics.test_f1 || 0,
          selectedAsBest: modelName === liveBestModelName
        }))
      : databaseModels;

    const bestModel = models.find((model) => model.selectedAsBest) || (await ModelInformationModel.getBestModel());

    return res.status(200).json({
      success: true,
      message: 'Model performance retrieved successfully',
      data: {
        bestModel,
        models
      }
    });
  } catch (error) {
    logError('Model performance request failed', { message: error.message });
    return res.status(500).json({
      success: false,
      message: 'Failed to load model performance data'
    });
  }
}

module.exports = {
  getDashboard,
  getModelPerformance
};
