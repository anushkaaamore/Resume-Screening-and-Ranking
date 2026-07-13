const axios = require('axios');

class PredictionService {
  constructor() {
    this.client = axios.create({
      baseURL: process.env.ML_SERVICE_URL || 'http://localhost:8000',
      timeout: Number(process.env.ML_SERVICE_TIMEOUT_MS) || 15000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async predict(features) {
    const response = await this.client.post('/predict', features);
    return response.data;
  }

  async getModelPerformance() {
    const response = await this.client.get('/model-performance');
    return response.data;
  }

  async trainModels(payload = {}) {
    const response = await this.client.post('/train', payload);
    return response.data;
  }
}

module.exports = new PredictionService();
