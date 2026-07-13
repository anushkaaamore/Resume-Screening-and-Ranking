const CandidateModel = require('../models/candidateModel');
const { logInfo, logWarn, logError } = require('../utils/logger');

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

async function createCandidate(req, res) {
  try {
    const recruiterId = req.user?.id || req.body.recruiterId;

    if (!recruiterId) {
      return res.status(400).json({
        success: false,
        message: 'Recruiter ID is required'
      });
    }

    const candidateId = await CandidateModel.create({
      recruiterId,
      candidateName: req.body.candidateName,
      age: toNumber(req.body.age),
      gender: req.body.gender,
      degree: req.body.degree,
      branch: req.body.branch,
      collegeTier: req.body.collegeTier,
      cgpa: req.body.cgpa,
      programmingLanguages: toNumber(req.body.programmingLanguages),
      skillsCount: toNumber(req.body.skillsCount),
      projectsCount: toNumber(req.body.projectsCount),
      internshipCount: toNumber(req.body.internshipCount),
      certificationCount: toNumber(req.body.certificationCount),
      hackathonCount: toNumber(req.body.hackathonCount),
      codingScore: req.body.codingScore,
      communicationScore: req.body.communicationScore,
      leadershipScore: req.body.leadershipScore,
      experienceYears: req.body.experienceYears,
      shortlistedLabel: toNumber(req.body.shortlistedLabel)
    });

    const candidate = await CandidateModel.findById(candidateId);

    logInfo('Candidate created successfully', { candidateId, recruiterId });

    return res.status(201).json({
      success: true,
      message: 'Candidate created successfully',
      data: candidate
    });
  } catch (error) {
    logError('Create candidate failed', { message: error.message });
    return res.status(500).json({
      success: false,
      message: 'Failed to create candidate'
    });
  }
}

async function getCandidates(req, res) {
  try {
    const recruiterId = req.user?.id ? Number(req.query.recruiterId || req.user.id) : req.query.recruiterId;
    const page = Math.max(1, toNumber(req.query.page, 1));
    const limit = Math.max(1, Math.min(100, toNumber(req.query.limit, 20)));
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const [items, total] = await Promise.all([
      CandidateModel.findAll({ recruiterId, search, limit, offset }),
      CandidateModel.count({ recruiterId, search })
    ]);

    return res.status(200).json({
      success: true,
      message: 'Candidates retrieved successfully',
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
    logError('Get candidates failed', { message: error.message });
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve candidates'
    });
  }
}

async function updateCandidate(req, res) {
  try {
    const candidateId = Number(req.params.id);
    const affectedRows = await CandidateModel.update(candidateId, {
      recruiterId: req.body.recruiterId,
      candidateName: req.body.candidateName,
      age: req.body.age !== undefined ? toNumber(req.body.age) : undefined,
      gender: req.body.gender,
      degree: req.body.degree,
      branch: req.body.branch,
      collegeTier: req.body.collegeTier,
      cgpa: req.body.cgpa,
      programmingLanguages: req.body.programmingLanguages !== undefined ? toNumber(req.body.programmingLanguages) : undefined,
      skillsCount: req.body.skillsCount !== undefined ? toNumber(req.body.skillsCount) : undefined,
      projectsCount: req.body.projectsCount !== undefined ? toNumber(req.body.projectsCount) : undefined,
      internshipCount: req.body.internshipCount !== undefined ? toNumber(req.body.internshipCount) : undefined,
      certificationCount: req.body.certificationCount !== undefined ? toNumber(req.body.certificationCount) : undefined,
      hackathonCount: req.body.hackathonCount !== undefined ? toNumber(req.body.hackathonCount) : undefined,
      codingScore: req.body.codingScore,
      communicationScore: req.body.communicationScore,
      leadershipScore: req.body.leadershipScore,
      experienceYears: req.body.experienceYears,
      shortlistedLabel: req.body.shortlistedLabel !== undefined ? toNumber(req.body.shortlistedLabel) : undefined
    });

    if (!affectedRows) {
      logWarn('Candidate update attempted for missing record', { candidateId });
      return res.status(404).json({
        success: false,
        message: 'Candidate not found or no changes provided'
      });
    }

    const candidate = await CandidateModel.findById(candidateId);

    return res.status(200).json({
      success: true,
      message: 'Candidate updated successfully',
      data: candidate
    });
  } catch (error) {
    logError('Update candidate failed', { message: error.message });
    return res.status(500).json({
      success: false,
      message: 'Failed to update candidate'
    });
  }
}

async function deleteCandidate(req, res) {
  try {
    const candidateId = Number(req.params.id);
    const affectedRows = await CandidateModel.remove(candidateId);

    if (!affectedRows) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Candidate deleted successfully'
    });
  } catch (error) {
    logError('Delete candidate failed', { message: error.message });
    return res.status(500).json({
      success: false,
      message: 'Failed to delete candidate'
    });
  }
}

module.exports = {
  createCandidate,
  getCandidates,
  updateCandidate,
  deleteCandidate
};
