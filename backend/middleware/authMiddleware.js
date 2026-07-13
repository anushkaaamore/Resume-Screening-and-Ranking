const jwt = require('jsonwebtoken');

function extractToken(authorizationHeader) {
  if (!authorizationHeader) {
    return null;
  }

  const parts = authorizationHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1].trim();
}

function authenticateToken(req, res, next) {
  const token = extractToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token is missing or invalid'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user && req.user.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource'
      });
    }

    return next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRoles
};
