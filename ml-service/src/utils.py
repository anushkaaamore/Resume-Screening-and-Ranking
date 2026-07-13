from __future__ import annotations

from pathlib import Path
from typing import Any, Dict

import pandas as pd


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / 'data'
RAW_DIR = DATA_DIR / 'raw'
PROCESSED_DIR = DATA_DIR / 'processed'
MODELS_DIR = BASE_DIR / 'models'


def ensure_directories() -> None:
    for directory in (DATA_DIR, RAW_DIR, PROCESSED_DIR, MODELS_DIR):
        directory.mkdir(parents=True, exist_ok=True)


def load_csv(path: Path) -> pd.DataFrame:
    return pd.read_csv(path)


def save_dataframe(frame: pd.DataFrame, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    frame.to_csv(path, index=False)


def to_serializable_mapping(data: Dict[str, Any]) -> Dict[str, Any]:
    return {
        key: (value.item() if hasattr(value, 'item') else value)
        for key, value in data.items()
    }
