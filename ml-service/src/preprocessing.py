from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, List, Optional, Tuple

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


@dataclass
class PreprocessingArtifacts:
    numeric_features: List[str]
    categorical_features: List[str]
    transformer: ColumnTransformer


class DataPreprocessor:
    def __init__(self, target_column: str = "shortlisted") -> None:
        self.target_column = target_column
        self.numeric_features: List[str] = []
        self.categorical_features: List[str] = []
        self.transformer: Optional[ColumnTransformer] = None

    def clean(self, frame: pd.DataFrame) -> pd.DataFrame:
        cleaned = frame.copy()
        cleaned = cleaned.drop_duplicates().reset_index(drop=True)
        cleaned = cleaned.replace({"": pd.NA, "null": pd.NA, "None": pd.NA})
        return cleaned

    def split_features_target(self, frame: pd.DataFrame) -> Tuple[pd.DataFrame, Optional[pd.Series]]:
        if self.target_column not in frame.columns:
            return frame.copy(), None

        features = frame.drop(columns=[self.target_column])
        target = frame[self.target_column]
        return features, target

    def infer_feature_types(self, frame: pd.DataFrame) -> None:
        self.numeric_features = [
            column
            for column in frame.columns
            if pd.api.types.is_numeric_dtype(frame[column])
        ]
        self.categorical_features = [column for column in frame.columns if column not in self.numeric_features]

    def build_transformer(self, frame: pd.DataFrame) -> ColumnTransformer:
        self.infer_feature_types(frame)

        numeric_pipeline = Pipeline(
            steps=[
                ("imputer", SimpleImputer(strategy="median")),
                ("scaler", StandardScaler())
            ]
        )

        categorical_pipeline = Pipeline(
            steps=[
                ("imputer", SimpleImputer(strategy="most_frequent")),
                ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
            ]
        )

        transformer = ColumnTransformer(
            transformers=[
                ("numeric", numeric_pipeline, self.numeric_features),
                ("categorical", categorical_pipeline, self.categorical_features)
            ],
            remainder="drop"
        )

        self.transformer = transformer
        return transformer

    def fit_transform(self, frame: pd.DataFrame) -> pd.DataFrame:
        cleaned = self.clean(frame)
        transformer = self.build_transformer(cleaned)
        transformed = transformer.fit_transform(cleaned)
        return pd.DataFrame(transformed)

    def transform(self, frame: pd.DataFrame) -> pd.DataFrame:
        if self.transformer is None:
            raise RuntimeError("Preprocessing transformer has not been fitted yet")

        cleaned = self.clean(frame)
        transformed = self.transformer.transform(cleaned)
        return pd.DataFrame(transformed)

    def get_artifacts(self) -> PreprocessingArtifacts:
        if self.transformer is None:
            raise RuntimeError("Preprocessing transformer has not been fitted yet")

        return PreprocessingArtifacts(
            numeric_features=self.numeric_features,
            categorical_features=self.categorical_features,
            transformer=self.transformer
        )
