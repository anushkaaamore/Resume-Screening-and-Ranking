const { pool } = require('../config/db');

class PredictionHistoryModel {
  static async create(record) {
    const {
      candidateId,
      recruiterId,
      predictedLabel,
      probability,
      modelName,
      modelVersion,
      featureSnapshot
    } = record;

    const [result] = await pool.execute(
      `INSERT INTO prediction_history (
        candidate_id,
        recruiter_id,
        predicted_label,
        probability,
        model_name,
        model_version,
        feature_snapshot
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        candidateId,
        recruiterId,
        predictedLabel ? 1 : 0,
        probability,
        modelName,
        modelVersion,
        JSON.stringify(featureSnapshot)
      ]
    );

    return result.insertId;
  }

  static async findAll({ recruiterId, limit = 20, offset = 0 } = {}) {
    const values = [];
    const conditions = [];

    if (recruiterId !== undefined) {
      conditions.push('recruiter_id = ?');
      values.push(recruiterId);
    }

    values.push(Number(limit), Number(offset));

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.execute(
      `SELECT id,
              candidate_id AS candidateId,
              recruiter_id AS recruiterId,
              predicted_label AS predictedLabel,
              probability,
              model_name AS modelName,
              model_version AS modelVersion,
              feature_snapshot AS featureSnapshot,
              created_at AS createdAt
       FROM prediction_history
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      values
    );

    return rows.map((row) => ({
      ...row,
      featureSnapshot: typeof row.featureSnapshot === 'string' ? JSON.parse(row.featureSnapshot) : row.featureSnapshot
    }));
  }

  static async count({ recruiterId } = {}) {
    const values = [];
    const conditions = [];

    if (recruiterId !== undefined) {
      conditions.push('recruiter_id = ?');
      values.push(recruiterId);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.execute(
      `SELECT COUNT(*) AS total
       FROM prediction_history
       ${whereClause}`,
      values
    );

    return rows[0]?.total || 0;
  }
}

module.exports = PredictionHistoryModel;
