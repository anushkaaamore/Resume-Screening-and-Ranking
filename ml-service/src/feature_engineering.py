from __future__ import annotations

import pandas as pd


class FeatureEngineer:
    def create_features(self, frame: pd.DataFrame) -> pd.DataFrame:
        engineered = frame.copy()

        if {"projects_count", "internship_count"}.issubset(engineered.columns):
            engineered["experience_signal"] = (
                engineered["projects_count"].fillna(0) + engineered["internship_count"].fillna(0)
            )

        if {"coding_score", "communication_score", "leadership_score"}.issubset(engineered.columns):
            engineered["soft_skill_average"] = (
                engineered[["coding_score", "communication_score", "leadership_score"]].fillna(0).mean(axis=1)
            )

        if {"cgpa", "experience_years"}.issubset(engineered.columns):
            engineered["academic_professional_balance"] = (
                engineered["cgpa"].fillna(0) * 0.6 + engineered["experience_years"].fillna(0) * 0.4
            )

        return engineered
