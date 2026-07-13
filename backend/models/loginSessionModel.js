const { pool } = require('../config/db');

class LoginSessionModel {
  static async create({ recruiterId, jwtId, expiresAt }) {
    const [result] = await pool.execute(
      `INSERT INTO login_sessions (
        recruiter_id,
        jwt_id,
        expires_at
      ) VALUES (?, ?, ?)`,
      [recruiterId, jwtId, expiresAt]
    );

    return result.insertId;
  }

  static async removeByJwtId(jwtId) {
    const [result] = await pool.execute(
      `DELETE FROM login_sessions
       WHERE jwt_id = ?`,
      [jwtId]
    );

    return result.affectedRows;
  }

  static async purgeExpiredSessions() {
    const [result] = await pool.execute(
      `DELETE FROM login_sessions
       WHERE expires_at < NOW()`
    );

    return result.affectedRows;
  }
}

module.exports = LoginSessionModel;
