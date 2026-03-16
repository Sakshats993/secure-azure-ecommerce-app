const { SecretClient } = require('@azure/keyvault-secrets');
const { DefaultAzureCredential } = require('@azure/identity');
const logger = require('../utils/logger');

class KeyVaultService {
  constructor() {
    this.client = null;
    this.vaultUrl = null;
  }

  initialize() {
    if (!process.env.KEY_VAULT_NAME) {
      logger.warn('KEY_VAULT_NAME not configured, skipping Key Vault initialization');
      return;
    }

    this.vaultUrl = `https://${process.env.KEY_VAULT_NAME}.vault.azure.net`;
    const credential = new DefaultAzureCredential();
    this.client = new SecretClient(this.vaultUrl, credential);
    
    logger.info(`Key Vault initialized: ${this.vaultUrl}`);
  }

  async getSecret(secretName) {
    try {
      if (!this.client) {
        this.initialize();
      }

      if (!this.client) {
        throw new Error('Key Vault client not initialized');
      }

      const secret = await this.client.getSecret(secretName);
      logger.info(`Retrieved secret: ${secretName}`);
      return secret.value;
    } catch (error) {
      logger.error(`Failed to retrieve secret ${secretName}:`, error);
      throw error;
    }
  }

  async setSecret(secretName, secretValue) {
    try {
      if (!this.client) {
        this.initialize();
      }

      await this.client.setSecret(secretName, secretValue);
      logger.info(`Secret set: ${secretName}`);
      return true;
    } catch (error) {
      logger.error(`Failed to set secret ${secretName}:`, error);
      throw error;
    }
  }

  async listSecrets() {
    try {
      if (!this.client) {
        this.initialize();
      }

      const secrets = [];
      for await (const secretProperties of this.client.listPropertiesOfSecrets()) {
        secrets.push({
          name: secretProperties.name,
          enabled: secretProperties.enabled,
          createdOn: secretProperties.createdOn
        });
      }
      return secrets;
    } catch (error) {
      logger.error('Failed to list secrets:', error);
      throw error;
    }
  }

  async deleteSecret(secretName) {
    try {
      if (!this.client) {
        this.initialize();
      }

      const poller = await this.client.beginDeleteSecret(secretName);
      await poller.pollUntilDone();
      logger.info(`Secret deleted: ${secretName}`);
      return true;
    } catch (error) {
      logger.error(`Failed to delete secret ${secretName}:`, error);
      throw error;
    }
  }
}

module.exports = new KeyVaultService();