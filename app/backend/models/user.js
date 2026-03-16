const db = require('../config/database');

class User {
  /**
   * Find user by Azure AD B2C Object ID
   */
  static async findByAzureId(azureAdB2CObjectId) {
    const query = `
      SELECT UserId, AzureAdB2CObjectId, Email, FirstName, LastName, 
             PhoneNumber, CreatedAt, UpdatedAt, IsActive
      FROM Users
      WHERE AzureAdB2CObjectId = @azureAdB2CObjectId AND IsActive = 1
    `;

    const results = await db.query(query, { azureAdB2CObjectId });
    return results[0] || null;
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const query = `
      SELECT UserId, AzureAdB2CObjectId, Email, FirstName, LastName, 
             PhoneNumber, CreatedAt, UpdatedAt, IsActive
      FROM Users
      WHERE Email = @email AND IsActive = 1
    `;

    const results = await db.query(query, { email });
    return results[0] || null;
  }

  /**
   * Create new user
   */
  static async create(userData) {
    const query = `
      INSERT INTO Users (AzureAdB2CObjectId, Email, FirstName, LastName, PhoneNumber)
      OUTPUT INSERTED.*
      VALUES (@azureAdB2CObjectId, @email, @firstName, @lastName, @phoneNumber)
    `;

    const results = await db.query(query, userData);
    return results[0];
  }

  /**
   * Update user profile
   */
  static async update(userId, userData) {
    const query = `
      UPDATE Users
      SET FirstName = @firstName,
          LastName = @lastName,
          PhoneNumber = @phoneNumber,
          UpdatedAt = GETUTCDATE()
      OUTPUT INSERTED.*
      WHERE UserId = @userId
    `;

    const results = await db.query(query, { ...userData, userId });
    return results[0] || null;
  }

  /**
   * Find or create user (for first-time login)
   */
  static async findOrCreate(azureUser) {
    let user = await this.findByAzureId(azureUser.oid);

    if (!user) {
      user = await this.create({
        azureAdB2CObjectId: azureUser.oid,
        email: azureUser.emails?.[0] || azureUser.email || '',
        firstName: azureUser.given_name || '',
        lastName: azureUser.family_name || '',
        phoneNumber: null
      });
    }

    return user;
  }

  /**
   * Deactivate user
   */
  static async deactivate(userId) {
    const query = `
      UPDATE Users
      SET IsActive = 0,
          UpdatedAt = GETUTCDATE()
      WHERE UserId = @userId
    `;

    await db.query(query, { userId });
    return true;
  }
}

module.exports = User;