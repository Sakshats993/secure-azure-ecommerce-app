const passport = require('passport');
const logger = require('../utils/logger');

/**
 * Middleware to verify Azure AD B2C JWT token
 */
const authenticateToken = (req, res, next) => {
  passport.authenticate('oauth-bearer', { session: false }, (err, user, info) => {
    if (err) {
      logger.error('Authentication error:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'Authentication failed' 
      });
    }

    if (!user) {
      logger.warn('Authentication failed:', info);
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized - Invalid or missing token' 
      });
    }

    // Attach user to request
    req.user = user;
    req.authInfo = info;
    
    logger.info(`User authenticated: ${user.oid || user.sub}`);
    next();
  })(req, res, next);
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token provided, continue without authentication
    return next();
  }

  // Token provided, validate it
  authenticateToken(req, res, next);
};

/**
 * Role-based access control middleware
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required' 
      });
    }

    const userRoles = req.user.roles || [];
    const hasRole = roles.some(role => userRoles.includes(role));

    if (!hasRole) {
      logger.warn(`User ${req.user.oid} attempted to access role-restricted resource`);
      return res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
    }

    next();
  };
};

/**
 * Audit logging middleware
 */
const auditLog = (req, res, next) => {
  const originalSend = res.json;
  
  res.json = function(data) {
    // Log the request and response
    logger.info('API Request', {
      method: req.method,
      path: req.path,
      userId: req.user?.oid || 'anonymous',
      ip: req.ip,
      userAgent: req.get('user-agent'),
      statusCode: res.statusCode,
      timestamp: new Date().toISOString()
    });

    originalSend.call(this, data);
  };

  next();
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireRole,
  auditLog
};