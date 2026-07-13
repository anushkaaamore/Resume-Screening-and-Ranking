const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const apiRoutes = require('./routes');
const { testConnection } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

app.use(helmet());
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Resume Screening backend is running',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res, next) => {
  const notFoundError = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  notFoundError.status = 404;
  next(notFoundError);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' ? { stack: error.stack } : {})
  });
});

async function startServer() {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start backend server:', error.message);
    process.exit(1);
  }
}

startServer();
