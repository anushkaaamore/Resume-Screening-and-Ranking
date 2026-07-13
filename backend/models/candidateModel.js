const { pool } = require('../config/db');

const baseSelectColumns = `
  id,
  recruiter_id AS recruiterId,
  candidate_name AS candidateName,
  age,
  gender,
  degree,
  branch,
  college_tier AS collegeTier,
  cgpa,
  programming_languages AS programmingLanguages,
  skills_count AS skillsCount,
  projects_count AS projectsCount,
  internship_count AS internshipCount,
  certification_count AS certificationCount,
  hackathon_count AS hackathonCount,
  coding_score AS codingScore,
  communication_score AS communicationScore,
  leadership_score AS leadershipScore,
  experience_years AS experienceYears,
  shortlisted_label AS shortlistedLabel,
  created_at AS createdAt,
  updated_at AS updatedAt
`;

class CandidateModel {
  static async create(candidate) {
    const {
      recruiterId,
      candidateName,
      age,
      gender,
      degree,
      branch,
      collegeTier,
      cgpa,
      programmingLanguages,
      skillsCount,
      projectsCount,
      internshipCount,
      certificationCount,
      hackathonCount,
      codingScore,
      communicationScore,
      leadershipScore,
      experienceYears,
      shortlistedLabel = 0
    } = candidate;

    const [result] = await pool.execute(
      `INSERT INTO candidates (
        recruiter_id,
        candidate_name,
        age,
        gender,
        degree,
        branch,
        college_tier,
        cgpa,
        programming_languages,
        skills_count,
        projects_count,
        internship_count,
        certification_count,
        hackathon_count,
        coding_score,
        communication_score,
        leadership_score,
        experience_years,
        shortlisted_label
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        recruiterId,
        candidateName,
        age,
        gender,
        degree,
        branch,
        collegeTier,
        cgpa,
        programmingLanguages,
        skillsCount,
        projectsCount,
        internshipCount,
        certificationCount,
        hackathonCount,
        codingScore,
        communicationScore,
        leadershipScore,
        experienceYears,
        shortlistedLabel
      ]
    );

    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT ${baseSelectColumns}
       FROM candidates
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    return rows[0] || null;
  }

  static async findAll({ recruiterId, search = '', limit = 20, offset = 0 } = {}) {
    const values = [];
    const conditions = [];

    if (recruiterId !== undefined) {
      conditions.push('recruiter_id = ?');
      values.push(recruiterId);
    }

    if (search) {
      conditions.push('(candidate_name LIKE ? OR degree LIKE ? OR branch LIKE ?)');
      const searchTerm = `%${search}%`;
      values.push(searchTerm, searchTerm, searchTerm);
    }

    values.push(Number(limit), Number(offset));

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.execute(
      `SELECT ${baseSelectColumns}
       FROM candidates
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      values
    );

    return rows;
  }

  static async count({ recruiterId, search = '' } = {}) {
    const values = [];
    const conditions = [];

    if (recruiterId !== undefined) {
      conditions.push('recruiter_id = ?');
      values.push(recruiterId);
    }

    if (search) {
      conditions.push('(candidate_name LIKE ? OR degree LIKE ? OR branch LIKE ?)');
      const searchTerm = `%${search}%`;
      values.push(searchTerm, searchTerm, searchTerm);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.execute(
      `SELECT COUNT(*) AS total
       FROM candidates
       ${whereClause}`,
      values
    );

    return rows[0]?.total || 0;
  }

  static async update(id, candidate) {
    const fieldMap = {
      recruiterId: 'recruiter_id',
      candidateName: 'candidate_name',
      age: 'age',
      gender: 'gender',
      degree: 'degree',
      branch: 'branch',
      collegeTier: 'college_tier',
      cgpa: 'cgpa',
      programmingLanguages: 'programming_languages',
      skillsCount: 'skills_count',
      projectsCount: 'projects_count',
      internshipCount: 'internship_count',
      certificationCount: 'certification_count',
      hackathonCount: 'hackathon_count',
      codingScore: 'coding_score',
      communicationScore: 'communication_score',
      leadershipScore: 'leadership_score',
      experienceYears: 'experience_years',
      shortlistedLabel: 'shortlisted_label'
    };

    const updates = [];
    const values = [];

    Object.entries(candidate).forEach(([key, value]) => {
      if (value !== undefined && fieldMap[key]) {
        updates.push(`${fieldMap[key]} = ?`);
        values.push(value);
      }
    });

    if (!updates.length) {
      return 0;
    }

    values.push(id);

    const [result] = await pool.execute(
      `UPDATE candidates
       SET ${updates.join(', ')}
       WHERE id = ?`,
      values
    );

    return result.affectedRows;
  }

  static async remove(id) {
    const [result] = await pool.execute(
      `DELETE FROM candidates
       WHERE id = ?`,
      [id]
    );

    return result.affectedRows;
  }
}

module.exports = CandidateModel;
