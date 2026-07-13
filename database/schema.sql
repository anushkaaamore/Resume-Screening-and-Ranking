CREATE DATABASE IF NOT EXISTS resume_screening_system;
USE resume_screening_system;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS prediction_history;
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS model_information;
DROP TABLE IF EXISTS login_sessions;
DROP TABLE IF EXISTS recruiters;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE recruiters (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'recruiter',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_recruiters_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE candidates (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    recruiter_id BIGINT UNSIGNED NOT NULL,
    candidate_name VARCHAR(150) NOT NULL,
    age INT UNSIGNED NOT NULL,
    gender VARCHAR(30) NOT NULL,
    degree VARCHAR(100) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    college_tier VARCHAR(50) NOT NULL,
    cgpa DECIMAL(4,2) NOT NULL,
    programming_languages INT UNSIGNED NOT NULL DEFAULT 0,
    skills_count INT UNSIGNED NOT NULL DEFAULT 0,
    projects_count INT UNSIGNED NOT NULL DEFAULT 0,
    internship_count INT UNSIGNED NOT NULL DEFAULT 0,
    certification_count INT UNSIGNED NOT NULL DEFAULT 0,
    hackathon_count INT UNSIGNED NOT NULL DEFAULT 0,
    coding_score DECIMAL(5,2) NOT NULL,
    communication_score DECIMAL(5,2) NOT NULL,
    leadership_score DECIMAL(5,2) NOT NULL,
    experience_years DECIMAL(4,2) NOT NULL DEFAULT 0,
    shortlisted_label TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_candidates_recruiter_id (recruiter_id),
    KEY idx_candidates_shortlisted_label (shortlisted_label),
    CONSTRAINT fk_candidates_recruiter_id
        FOREIGN KEY (recruiter_id)
        REFERENCES recruiters (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE model_information (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    model_name VARCHAR(100) NOT NULL,
    model_type VARCHAR(100) NOT NULL,
    accuracy DECIMAL(6,4) NOT NULL DEFAULT 0,
    precision_score DECIMAL(6,4) NOT NULL DEFAULT 0,
    recall_score DECIMAL(6,4) NOT NULL DEFAULT 0,
    f1_score DECIMAL(6,4) NOT NULL DEFAULT 0,
    roc_auc DECIMAL(6,4) NOT NULL DEFAULT 0,
    cross_validation_score DECIMAL(6,4) NOT NULL DEFAULT 0,
    selected_as_best TINYINT(1) NOT NULL DEFAULT 0,
    trained_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    artifact_path VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_model_information_selected_as_best (selected_as_best),
    KEY idx_model_information_model_name (model_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE login_sessions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    recruiter_id BIGINT UNSIGNED NOT NULL,
    jwt_id VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_login_sessions_jwt_id (jwt_id),
    KEY idx_login_sessions_recruiter_id (recruiter_id),
    KEY idx_login_sessions_expires_at (expires_at),
    CONSTRAINT fk_login_sessions_recruiter_id
        FOREIGN KEY (recruiter_id)
        REFERENCES recruiters (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE prediction_history (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    candidate_id BIGINT UNSIGNED NOT NULL,
    recruiter_id BIGINT UNSIGNED NOT NULL,
    predicted_label TINYINT(1) NOT NULL,
    probability DECIMAL(6,4) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(100) NOT NULL,
    feature_snapshot JSON NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_prediction_history_candidate_id (candidate_id),
    KEY idx_prediction_history_recruiter_id (recruiter_id),
    KEY idx_prediction_history_created_at (created_at),
    CONSTRAINT fk_prediction_history_candidate_id
        FOREIGN KEY (candidate_id)
        REFERENCES candidates (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_prediction_history_recruiter_id
        FOREIGN KEY (recruiter_id)
        REFERENCES recruiters (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO model_information (
    model_name,
    model_type,
    accuracy,
    precision_score,
    recall_score,
    f1_score,
    roc_auc,
    cross_validation_score,
    selected_as_best,
    artifact_path
) VALUES
('Logistic Regression', 'classification', 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0, 'models/logistic_regression.pkl'),
('Decision Tree', 'classification', 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0, 'models/decision_tree.pkl'),
('Random Forest', 'classification', 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 1, 'models/best_model.pkl');
