from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Tuple

import joblib
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GridSearchCV, StratifiedKFold, train_test_split, cross_validate
from sklearn.pipeline import Pipeline
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

from src.feature_engineering import FeatureEngineer
from src.preprocessing import DataPreprocessor


@dataclass
class TrainingResult:
    model_name: str
    best_score: float
    metrics: Dict[str, float]
    artifact_path: Path


class ModelTrainer:
    def __init__(self, target_column: str = "shortlisted", random_state: int = 42) -> None:
        self.target_column = target_column
        self.random_state = random_state
        self.preprocessor = DataPreprocessor(target_column=target_column)
        self.feature_engineer = FeatureEngineer()

    def _build_model_grid(self) -> Dict[str, Tuple[Pipeline, Dict[str, list]]]:
        return {
            "Logistic Regression": (
                Pipeline(
                    steps=[
                        ("classifier", LogisticRegression(max_iter=1000, class_weight="balanced", random_state=self.random_state))
                    ]
                ),
                {
                    "C": [0.1, 1.0, 10.0],
                    "solver": ["lbfgs", "liblinear"]
                }
            ),
            "Decision Tree": (
                Pipeline(
                    steps=[
                        ("classifier", DecisionTreeClassifier(random_state=self.random_state, class_weight="balanced"))
                    ]
                ),
                {
                    "max_depth": [3, 5, 8, None],
                    "min_samples_split": [2, 5, 10]
                }
            ),
            "Random Forest": (
                Pipeline(
                    steps=[
                        ("classifier", RandomForestClassifier(random_state=self.random_state, class_weight="balanced"))
                    ]
                ),
                {
                    "n_estimators": [100, 200],
                    "max_depth": [None, 8, 12],
                    "min_samples_split": [2, 5]
                }
            )
        }

    def prepare_data(self, frame: pd.DataFrame):
        enriched = self.feature_engineer.create_features(frame)
        features, target = self.preprocessor.split_features_target(enriched)
        if target is None:
            raise ValueError(f"Target column '{self.target_column}' not found")
        return features, target

    def train_and_select_best(self, frame: pd.DataFrame, output_dir: Path) -> TrainingResult:
        features, target = self.prepare_data(frame)
        transformer = self.preprocessor.build_transformer(features)
        x_train, x_test, y_train, y_test = train_test_split(
            features,
            target,
            test_size=0.2,
            random_state=self.random_state,
            stratify=target
        )

        best_score = -1.0
        best_model_name = ''
        best_estimator = None
        best_metrics: Dict[str, float] = {}
        all_results: Dict[str, Dict[str, float]] = {}

        models = self._build_model_grid()
        cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=self.random_state)

        for model_name, (pipeline, param_grid) in models.items():
            search = GridSearchCV(
                estimator=Pipeline([
                    ("transformer", transformer),
                    ("model", pipeline.named_steps["classifier"])
                ]),
                param_grid={f"model__{key}": value for key, value in param_grid.items()},
                scoring="f1",
                cv=cv,
                n_jobs=-1,
                refit=True
            )
            search.fit(x_train, y_train)
            candidate_score = float(search.best_score_)

            evaluation = cross_validate(
                search.best_estimator_,
                x_train,
                y_train,
                scoring={
                    "accuracy": "accuracy",
                    "precision": "precision",
                    "recall": "recall",
                    "f1": "f1",
                    "roc_auc": "roc_auc"
                },
                cv=cv,
                n_jobs=-1
            )

            all_results[model_name] = {
                metric: float(values.mean())
                for metric, values in evaluation.items()
                if metric.startswith('test_')
            }

            if candidate_score > best_score:
                best_score = candidate_score
                best_model_name = model_name
                best_estimator = search.best_estimator_
                best_metrics = all_results[model_name]

        if best_estimator is None:
            raise RuntimeError('No model was selected during training')

        output_dir.mkdir(parents=True, exist_ok=True)
        artifact_path = output_dir / 'best_model.pkl'
        joblib.dump(
            {
                'model_name': best_model_name,
                'model': best_estimator,
                'target_column': self.target_column,
                'metrics': best_metrics,
                'model_results': all_results
            },
            artifact_path
        )

        return TrainingResult(
            model_name=best_model_name,
            best_score=best_score,
            metrics=best_metrics,
            artifact_path=artifact_path
        )
