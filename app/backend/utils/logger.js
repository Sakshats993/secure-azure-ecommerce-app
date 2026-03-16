const winston = require('winston');
const appInsights = require('applicationinsights');

// Initialize Application Insights
if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
  appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .start();
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'ecommerce-api' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Log to Application Insights in production
if (process.env.NODE_ENV === 'production' && appInsights.defaultClient) {
  logger.add({
    log(info, callback) {
      setImmediate(() => {
        if (info.level === 'error') {
          appInsights.defaultClient.trackException({ exception: new Error(info.message) });
        } else {
          appInsights.defaultClient.trackTrace({ message: info.message, severity: info.level });
        }
      });
      callback();
    }
  });
}

module.exports = logger;