const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');
const auth = require('../config/azureAuth');

// Get user profile (protected route)
router.get('/profile', auth.authenticate(), async (req, res) => {
  try {
    const azureAdId = req.user.oid; // Object ID from Azure AD B2C token
    
    const query = `
      SELECT UserId, Email, FirstName, LastName, PhoneNumber, CreatedAt
      FROM Users
      WHERE AzureAdB2CObjectId = @azureAdId
    `;
    
    const users = await db.query(query, { azureAdId });
    
    if (users.length === 0) {
      // Create user if doesn't exist
      const insertQuery = `
        INSERT INTO Users (AzureAdB2CObjectId, Email, FirstName, LastName)
        OUTPUT INSERTED.*
        VALUES (@azureAdId, @email, @firstName, @lastName)
      `;
      
      const newUser = await db.query(insertQuery, {
        azureAdId,
        email: req.user.emails?.[0] || req.user.email,
        firstName: req.user.given_name || '',
        lastName: req.user.family_name || ''
      });
      
      return res.json({ success: true, data: newUser[0] });
    }
    
    res.json({ success: true, data: users[0] });
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', auth.authenticate(), async (req, res) => {
  try {
    const azureAdId = req.user.oid;
    const { firstName, lastName, phoneNumber } = req.body;
    
    const query = `
      UPDATE Users
      SET FirstName = @firstName,
          LastName = @lastName,
          PhoneNumber = @phoneNumber,
          UpdatedAt = GETUTCDATE()
      OUTPUT INSERTED.*
      WHERE AzureAdB2CObjectId = @azureAdId
    `;
    
    const updated = await db.query(query, { azureAdId, firstName, lastName, phoneNumber });
    
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    logger.error('Error updating user profile:', error);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
});

module.exports = router;