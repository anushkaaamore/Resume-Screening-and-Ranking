const { pool } = require('../config/db');

class RecruiterModel {
  static async create({ name, email, passwordHash, role = 'recruiter' }) {
    const [result] = await pool.execute(
      `INSERT INTO recruiters (name, email, password_hash, role)
       VALUES (?, ?, ?, ?)`,
      [name, email, passwordHash, role]
    );

    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      `SELECT id, name, email, password_hash AS passwordHash, role, created_at AS createdAt, updated_at AS updatedAt
       FROM recruiters
       WHERE email = ?
       LIMIT 1`,
      [email]
    );

    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT id, name, email, role, created_at AS createdAt, updated_at AS updatedAt
       FROM recruiters
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    return rows[0] || null;
  }

  static async updateProfile(id, { name, email, role }) {
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }

    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }

    if (role !== undefined) {
      updates.push('role = ?');
      values.push(role);
    }

    if (!updates.length) {
      return 0;
    }

    values.push(id);

    const [result] = await pool.execute(
      `UPDATE recruiters
       SET ${updates.join(', ')}
       WHERE id = ?`,
      values
    );

    return result.affectedRows;
  }
}

module.exports = RecruiterModel;
