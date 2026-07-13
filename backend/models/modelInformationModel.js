const { pool } = require('../config/db');

class ModelInformationModel {
  static async upsertModelResult(model) {
    const {
      modelName,
      modelType,
      accuracy,
      precisionScore,
      recallScore,
      f1Score,
      rocAuc,
      crossValidationScore,
      selectedAsBest,
      artifactPath,
      trainedAt = new Date()
    } = model;

    const [existingRows] = await pool.execute(
      `SELECT id
       FROM model_information
       WHERE model_name = ?
       LIMIT 1`,
      [modelName]
    );

    if (existingRows.length) {
      const [result] = await pool.execute(
        `UPDATE model_information
         SET model_type = ?,
             accuracy = ?,
             precision_score = ?,
             recall_score = ?,
             f1_score = ?,
             roc_auc = ?,
             cross_validation_score = ?,
             selected_as_best = ?,
             trained_at = ?,
             artifact_path = ?
         WHERE model_name = ?`,
        [
          modelType,
          accuracy,
          precisionScore,
          recallScore,
          f1Score,
          rocAuc,
          crossValidationScore,
          selectedAsBest ? 1 : 0,
          trainedAt,
          artifactPath,
          modelName
        ]
      );

      return result.affectedRows;
    }

    const [result] = await pool.execute(
      `INSERT INTO model_information (
        model_name,
        model_type,
        accuracy,
        precision_score,
        recall_score,
        f1_score,
        roc_auc,
        cross_validation_score,
        selected_as_best,
        trained_at,
        artifact_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        modelName,
        modelType,
        accuracy,
        precisionScore,
        recallScore,
        f1Score,
        rocAuc,
        crossValidationScore,
        selectedAsBest ? 1 : 0,
        trainedAt,
        artifactPath
      ]
    );

    return result.insertId;
  }

  static async clearBestFlag() {
    const [result] = await pool.execute(
      `UPDATE model_information
       SET selected_as_best = 0`
    );

    return result.affectedRows;
  }

  static async getAll() {
    const [rows] = await pool.execute(
      `SELECT id,
              model_name AS modelName,
              model_type AS modelType,
              accuracy,
              precision_score AS precisionScore,
              recall_score AS recallScore,
              f1_score AS f1Score,
              roc_auc AS rocAuc,
              cross_validation_score AS crossValidationScore,
              selected_as_best AS selectedAsBest,
              trained_at AS trainedAt,
              artifact_path AS artifactPath,
              created_at AS createdAt,
              updated_at AS updatedAt
       FROM model_information
       ORDER BY trained_at DESC, id DESC`
    );

    return rows;
  }

  static async getBestModel() {
    const [rows] = await pool.execute(
      `SELECT id,
              model_name AS modelName,
              model_type AS modelType,
              accuracy,
              precision_score AS precisionScore,
              recall_score AS recallScore,
              f1_score AS f1Score,
              roc_auc AS rocAuc,
              cross_validation_score AS crossValidationScore,
              selected_as_best AS selectedAsBest,
              trained_at AS trainedAt,
              artifact_path AS artifactPath
       FROM model_information
       WHERE selected_as_best = 1
       ORDER BY trained_at DESC, id DESC
       LIMIT 1`
    );

    return rows[0] || null;
  }
}

module.exports = ModelInformationModel;
