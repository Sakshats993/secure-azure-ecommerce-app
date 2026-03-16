const passport = require('passport');
const BearerStrategy = require('passport-azure-ad').BearerStrategy;

const options = {
  identityMetadata: `https://${process.env.AZURE_AD_B2C_TENANT_NAME}.b2clogin.com/${process.env.AZURE_AD_B2C_TENANT_NAME}.onmicrosoft.com/${process.env.AZURE_AD_B2C_POLICY_NAME}/v2.0/.well-known/openid-configuration`,
  clientID: process.env.AZURE_AD_B2C_CLIENT_ID,
  audience: process.env.AZURE_AD_B2C_CLIENT_ID,
  policyName: process.env.AZURE_AD_B2C_POLICY_NAME,
  isB2C: true,
  validateIssuer: true,
  loggingLevel: 'info',
  passReqToCallback: false,
  scope: ['openid', 'profile', 'email']
};

const bearerStrategy = new BearerStrategy(options, (token, done) => {
  // Token validation successful
  // You can add additional user validation here
  return done(null, token, token);
});

passport.use(bearerStrategy);

module.exports = {
  initialize: () => passport.initialize(),
  authenticate: () => passport.authenticate('oauth-bearer', { session: false })
};