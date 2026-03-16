const sql = require('mssql');
const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');
const logger = require('../utils/logger');

class DatabaseConfig {
  constructor() {
    this.pool = null;
    this.config = null;
  }

  async getConnectionString() {
    if (process.env.NODE_ENV === 'production') {
      // Get from Key Vault in production
      const credential = new DefaultAzureCredential();
      const vaultUrl = `https://${process.env.KEY_VAULT_NAME}.vault.azure.net`;
      const client = new SecretClient(vaultUrl, credential);
      
      try {
        const secret = await client.getSecret('SqlConnectionString');
        return secret.value;
      } catch (error) {
        logger.error('Failed to get SQL connection string from Key Vault', error);
        throw error;
      }
    } else {
      // Development configuration
      return {
        server: process.env.SQL_SERVER,
        database: process.env.SQL_DATABASE,
        user: process.env.SQL_USERNAME,
        password: process.env.SQL_PASSWORD,
        options: {
          encrypt: true,
          trustServerCertificate: false,
          enableArithAbort: true,
          connectionTimeout: 30000,
          requestTimeout: 30000
        },
        pool: {
          max: 10,
          min: 0,
          idleTimeoutMillis: 30000
        }
      };
    }
  }

  async connect() {
    try {
      if (this.pool) {
        return this.pool;
      }

      this.config = await this.getConnectionString();
      this.pool = await sql.connect(this.config);
      
      logger.info('Database connection established successfully');
      
      // Handle connection errors
      this.pool.on('error', err => {
        logger.error('Database pool error:', err);
      });

      return this.pool;
    } catch (error) {
      logger.error('Database connection failed:', error);
      throw error;
    }
  }

  async query(queryString, params = {}) {
    try {
      const pool = await this.connect();
      const request = pool.request();

      // Add parameters
      Object.keys(params).forEach(key => {
        request.input(key, params[key]);
      });

      const result = await request.query(queryString);
      return result.recordset;
    } catch (error) {
      logger.error('Query execution failed:', error);
      throw error;
    }
  }

  async close() {
    try {
      if (this.pool) {
        await this.pool.close();
        this.pool = null;
        logger.info('Database connection closed');
      }
    } catch (error) {
      logger.error('Error closing database connection:', error);
    }
  }
}

module.exports = new DatabaseConfig();