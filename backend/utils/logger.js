const { format } = require('util');

function serializeMeta(meta) {
  if (meta === null || meta === undefined) {
    return '';
  }

  if (typeof meta === 'string') {
    return meta;
  }

  try {
    return JSON.stringify(meta);
  } catch (error) {
    return format('%o', meta);
  }
}

function logInfo(message, meta) {
  const suffix = serializeMeta(meta);
  console.log(`[INFO] ${message}${suffix ? ` | ${suffix}` : ''}`);
}

function logWarn(message, meta) {
  const suffix = serializeMeta(meta);
  console.warn(`[WARN] ${message}${suffix ? ` | ${suffix}` : ''}`);
}

function logError(message, meta) {
  const suffix = serializeMeta(meta);
  console.error(`[ERROR] ${message}${suffix ? ` | ${suffix}` : ''}`);
}

module.exports = {
  logInfo,
  logWarn,
  logError
};
