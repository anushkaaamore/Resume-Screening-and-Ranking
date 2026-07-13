from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List

import joblib
import pandas as pd

from src.feature_engineering import FeatureEngineer


class PredictionEngine:
    def __init__(self, artifact_path: Path) -> None:
        self.artifact_path = artifact_path
        self.bundle = None
        self.feature_engineer = FeatureEngineer()

    def load(self) -> None:
        if not self.artifact_path.exists():
            raise FileNotFoundError(f'Artifact not found: {self.artifact_path}')
        self.bundle = joblib.load(self.artifact_path)

    def _extract_feature_importance(self, model) -> List[Dict[str, Any]]:
        classifier = model.named_steps.get('model') if hasattr(model, 'named_steps') else model
        feature_names = None

        if hasattr(model, 'named_steps') and 'transformer' in model.named_steps:
            transformer = model.named_steps['transformer']
            if hasattr(transformer, 'get_feature_names_out'):
                feature_names = list(transformer.get_feature_names_out())

        if hasattr(classifier, 'feature_importances_'):
            importances = getattr(classifier, 'feature_importances_')
            return [
                {
                    'feature': feature_names[index] if feature_names and index < len(feature_names) else f'feature_{index}',
                    'importance': float(score)
                }
                for index, score in enumerate(importances)
            ]

        if hasattr(classifier, 'coef_'):
            coefficients = getattr(classifier, 'coef_')[0]
            return [
                {
                    'feature': feature_names[index] if feature_names and index < len(feature_names) else f'feature_{index}',
                    'importance': float(score)
                }
                for index, score in enumerate(coefficients)
            ]

        return []

    def predict(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        if self.bundle is None:
            self.load()

        model = self.bundle['model']
        frame = pd.DataFrame([payload])
        frame = self.feature_engineer.create_features(frame)
        prediction = model.predict(frame)[0]
        probability = float(model.predict_proba(frame)[0][1]) if hasattr(model, 'predict_proba') else 0.0
        feature_importance = self._extract_feature_importance(model)
        reasons = [
            'Excellent Coding Score',
            'Multiple Projects',
            'Strong Internship Profile'
        ]

        return {
            'prediction': 'Shortlisted' if int(prediction) == 1 else 'Not Shortlisted',
            'probability': probability,
            'feature_importance': feature_importance,
            'reasons': reasons,
            'model_name': self.bundle.get('model_name', 'best_model'),
            'model_version': '1.0.0'
        }
