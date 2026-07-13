# Machine Learning Based Resume Screening and Candidate Ranking System

This README is written as a full developer handbook and interview guide for the actual code in this repository. It is intentionally detailed, beginner-friendly, and aligned with the current implementation in `backend/`, `frontend/`, `ml-service/`, and `database/`.

---

## 1. Project Overview

### What problem this project solves
Recruiters receive many candidate profiles and need a fast, consistent way to decide who should be shortlisted. Manual screening is slow, subjective, and hard to scale. This project solves that by taking structured candidate features and using classical machine learning to predict whether a candidate should be shortlisted.

### Why this project is needed
Traditional screening depends heavily on human judgment and can vary by recruiter, team, or day. This project introduces a repeatable scoring process that helps recruiters:
- save screening time,
- compare candidates consistently,
- explain shortlist decisions with measurable model output,
- keep a historical record of predictions.

### Who will use it
- Recruiters who screen candidates.
- Hiring managers who review shortlist quality.
- Admins who monitor model performance.
- Developers and data engineers who maintain the stack.

### Business value
- Faster shortlist decisions.
- Better screening consistency.
- Auditable prediction history.
- Better use of recruiter time.
- Measurable model performance instead of guesswork.

### Why Machine Learning is used
The project uses machine learning because the target outcome, `shortlisted`, can be learned from historical candidate features such as CGPA, project count, internship count, coding score, communication score, and leadership score. Classical ML helps turn those features into a prediction probability and a binary shortlist decision.

### Why this project is useful for recruiters
Recruiters can use the system to:
- store structured candidate data,
- compare candidates using the same rubric,
- get a shortlist probability,
- review prediction history,
- understand which features influenced a decision.

### Why React + Node + Express + Python + MySQL were chosen
- **React**: builds a responsive recruiter dashboard and reusable UI.
- **Node.js + Express**: provides fast API orchestration, authentication, and CRUD operations.
- **Python**: is the best fit for the classical ML pipeline.
- **MySQL**: stores relational data such as recruiters, candidates, models, and prediction history.
- **Flask inside the ML service**: exposes the Python model as a lightweight HTTP service.

### Allowed machine learning models
Only these models are used:
- Logistic Regression
- Decision Tree
- Random Forest

No LLMs, no deep learning, no OCR, no resume parsing, and no generative AI are used anywhere in this system.

---

## 2. System Architecture

### High-level architecture
```text
React Frontend
      |
      v
Node.js + Express Backend
      |
      v
Python Machine Learning Service (Flask)
      |
      v
MySQL Database
```

