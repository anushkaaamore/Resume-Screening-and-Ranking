from __future__ import annotations

import os
from pathlib import Path

import pandas as pd

from src.training import ModelTrainer
from src.utils import DATA_DIR, MODELS_DIR, RAW_DIR, ensure_directories


def load_training_dataset() -> pd.DataFrame:
    candidates = [
        Path(os.getenv('ML_TRAINING_DATA_PATH', RAW_DIR / 'candidates.csv')),
        DATA_DIR / 'dataset.csv'
    ]

    for candidate in candidates:
        if candidate.exists():
            return pd.read_csv(candidate)

    raise FileNotFoundError('Training dataset not found in the expected data directories')


def main() -> None:
    ensure_directories()
    dataset = load_training_dataset()
    trainer = ModelTrainer(target_column=os.getenv('ML_TARGET_COLUMN', 'shortlisted'))
    result = trainer.train_and_select_best(dataset, MODELS_DIR)

    print(f'Selected model: {result.model_name}')
    print(f'Cross-validation score: {result.best_score:.4f}')
    print(f'Artifact saved to: {result.artifact_path}')
    print(f'Metrics: {result.metrics}')


if __name__ == '__main__':
    main()
