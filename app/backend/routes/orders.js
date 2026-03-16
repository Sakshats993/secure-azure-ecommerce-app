const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');
const auth = require('../config/azureAuth');

// Get user orders
router.get('/', auth.authenticate(), async (req, res) => {
  try {
    const azureAdId = req.user.oid;
    
    const query = `
      SELECT o.OrderId, o.OrderDate, o.TotalAmount, o.Status, o.PaymentStatus,
             oi.ProductId, oi.Quantity, oi.UnitPrice, p.ProductName
      FROM Orders o
      JOIN Users u ON o.UserId = u.UserId
      LEFT JOIN OrderItems oi ON o.OrderId = oi.OrderId
      LEFT JOIN Products p ON oi.ProductId = p.ProductId
      WHERE u.AzureAdB2CObjectId = @azureAdId
      ORDER BY o.OrderDate DESC
    `;
    
    const orders = await db.query(query, { azureAdId });
    res.json({ success: true, data: orders });
  } catch (error) {
    logger.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

// Create new order
router.post('/', auth.authenticate(), async (req, res) => {
  const transaction = db.pool.transaction();
  
  try {
    const azureAdId = req.user.oid;
    const { items, shippingAddress, paymentMethod } = req.body;
    
    await transaction.begin();
    
    // Get user ID
    const userResult = await transaction.request()
      .input('azureAdId', azureAdId)
      .query('SELECT UserId FROM Users WHERE AzureAdB2CObjectId = @azureAdId');
    
    const userId = userResult.recordset[0].UserId;
    
    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order
    const orderResult = await transaction.request()
      .input('userId', userId)
      .input('totalAmount', total)
      .input('shippingAddress', shippingAddress)
      .input('paymentMethod', paymentMethod)
      .query(`
        INSERT INTO Orders (UserId, TotalAmount, ShippingAddress, PaymentMethod)
        OUTPUT INSERTED.OrderId
        VALUES (@userId, @totalAmount, @shippingAddress, @paymentMethod)
      `);
    
    const orderId = orderResult.recordset[0].OrderId;
    
    // Add order items
    for (const item of items) {
      await transaction.request()
        .input('orderId', orderId)
        .input('productId', item.productId)
        .input('quantity', item.quantity)
        .input('unitPrice', item.price)
        .query(`
          INSERT INTO OrderItems (OrderId, ProductId, Quantity, UnitPrice)
          VALUES (@orderId, @productId, @quantity, @unitPrice)
        `);
      
      // Update stock
      await transaction.request()
        .input('productId', item.productId)
        .input('quantity', item.quantity)
        .query(`
          UPDATE Products 
          SET StockQuantity = StockQuantity - @quantity
          WHERE ProductId = @productId
        `);
    }
    
    await transaction.commit();
    
    logger.info(`Order created: ${orderId}`);
    res.status(201).json({ success: true, data: { orderId } });
  } catch (error) {
    await transaction.rollback();
    logger.error('Error creating order:', error);
    res.status(500).json({ success: false, error: 'Failed to create order' });
  }
});

module.exports = router;