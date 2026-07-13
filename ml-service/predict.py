from __future__ import annotations

import os
from pathlib import Path

from flask import Flask, jsonify, request

from src.prediction import PredictionEngine
from src.utils import MODELS_DIR, ensure_directories

ensure_directories()

app = Flask(__name__)
artifact_path = Path(os.getenv('ML_MODEL_PATH', MODELS_DIR / 'best_model.pkl'))
prediction_engine = PredictionEngine(artifact_path)


@app.get('/health')
def health():
    return jsonify(
        {
            'success': True,
            'message': 'ML service is running'
        }
    )


@app.post('/predict')
def predict():
    payload = request.get_json(silent=True) or {}
    if not payload:
        return jsonify({'success': False, 'message': 'Prediction payload is required'}), 400

    try:
        result = prediction_engine.predict(payload)
        return jsonify({'success': True, 'data': result})
    except Exception as error:
        return jsonify({'success': False, 'message': str(error)}), 500


@app.get('/model-performance')
def model_performance():
    if prediction_engine.bundle is None and artifact_path.exists():
        prediction_engine.load()

    bundle = prediction_engine.bundle or {}
    metrics = bundle.get('metrics', {})
    model_results = bundle.get('model_results', {})

    return jsonify(
        {
            'success': True,
            'data': {
                'modelName': bundle.get('model_name', 'best_model'),
                'artifactPath': str(artifact_path),
                'metrics': metrics,
                'modelResults': model_results
            }
        }
    )


if __name__ == '__main__':
    port = int(os.getenv('ML_SERVICE_PORT', '8000'))
    app.run(host='0.0.0.0', port=port, debug=os.getenv('FLASK_DEBUG', 'false').lower() == 'true')
