from __future__ import annotations

from dataclasses import dataclass
from typing import Dict

import numpy as np
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, precision_score, recall_score, roc_auc_score


@dataclass
class EvaluationReport:
    accuracy: float
    precision: float
    recall: float
    f1: float
    roc_auc: float
    confusion_matrix: list


class ModelEvaluator:
    def evaluate(self, model, x_test, y_test) -> Dict[str, float]:
        probabilities = model.predict_proba(x_test)[:, 1] if hasattr(model, 'predict_proba') else None
        predictions = model.predict(x_test)

        report = EvaluationReport(
            accuracy=float(accuracy_score(y_test, predictions)),
            precision=float(precision_score(y_test, predictions, zero_division=0)),
            recall=float(recall_score(y_test, predictions, zero_division=0)),
            f1=float(f1_score(y_test, predictions, zero_division=0)),
            roc_auc=float(roc_auc_score(y_test, probabilities)) if probabilities is not None else 0.0,
            confusion_matrix=confusion_matrix(y_test, predictions).tolist()
        )

        return report.__dict__
