export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_AD_B2C_CLIENT_ID,
    authority: `https://${process.env.REACT_APP_AZURE_AD_B2C_TENANT_NAME}.b2clogin.com/${process.env.REACT_APP_AZURE_AD_B2C_TENANT_NAME}.onmicrosoft.com/${process.env.REACT_APP_AZURE_AD_B2C_POLICY_NAME}`,
    knownAuthorities: [`${process.env.REACT_APP_AZURE_AD_B2C_TENANT_NAME}.b2clogin.com`],
    redirectUri: process.env.REACT_APP_AZURE_AD_B2C_REDIRECT_URI || 'http://localhost:3001',
    postLogoutRedirectUri: process.env.REACT_APP_AZURE_AD_B2C_REDIRECT_URI || 'http://localhost:3001'
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false
  }
};

export const loginRequest = {
  scopes: ['openid', 'profile', 'email']
};

export const tokenRequest = {
  scopes: [`https://${process.env.REACT_APP_AZURE_AD_B2C_TENANT_NAME}.onmicrosoft.com/${process.env.REACT_APP_AZURE_AD_B2C_CLIENT_ID}/user.read`]
};