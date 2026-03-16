const db = require('../config/database');
const sql = require('mssql');

class Order {
  /**
   * Get all orders for a user
   */
  static async findByUserId(userId) {
    const query = `
      SELECT o.OrderId, o.OrderDate, o.TotalAmount, o.Status, o.PaymentStatus,
             o.ShippingAddress, o.PaymentMethod, o.CreatedAt
      FROM Orders o
      WHERE o.UserId = @userId
      ORDER BY o.OrderDate DESC
    `;

    return await db.query(query, { userId });
  }

  /**
   * Get order by ID
   */
  static async findById(orderId) {
    const query = `
      SELECT o.*, u.Email, u.FirstName, u.LastName
      FROM Orders o
      JOIN Users u ON o.UserId = u.UserId
      WHERE o.OrderId = @orderId
    `;

    const results = await db.query(query, { orderId });
    return results[0] || null;
  }

  /**
   * Get order items
   */
  static async getOrderItems(orderId) {
    const query = `
      SELECT oi.*, p.ProductName, p.ImageUrl
      FROM OrderItems oi
      JOIN Products p ON oi.ProductId = p.ProductId
      WHERE oi.OrderId = @orderId
    `;

    return await db.query(query, { orderId });
  }

  /**
   * Create new order
   */
  static async create(orderData, items) {
    const pool = await db.connect();
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      // Create order
      const orderRequest = new sql.Request(transaction);
      orderRequest.input('userId', sql.UniqueIdentifier, orderData.userId);
      orderRequest.input('totalAmount', sql.Decimal(10, 2), orderData.totalAmount);
      orderRequest.input('shippingAddress', sql.NVarChar, orderData.shippingAddress);
      orderRequest.input('paymentMethod', sql.NVarChar, orderData.paymentMethod);

      const orderResult = await orderRequest.query(`
        INSERT INTO Orders (UserId, TotalAmount, ShippingAddress, PaymentMethod)
        OUTPUT INSERTED.OrderId
        VALUES (@userId, @totalAmount, @shippingAddress, @paymentMethod)
      `);

      const orderId = orderResult.recordset[0].OrderId;

      // Create order items and update stock
      for (const item of items) {
        const itemRequest = new sql.Request(transaction);
        itemRequest.input('orderId', sql.UniqueIdentifier, orderId);
        itemRequest.input('productId', sql.Int, item.productId);
        itemRequest.input('quantity', sql.Int, item.quantity);
        itemRequest.input('unitPrice', sql.Decimal(10, 2), item.unitPrice);

        await itemRequest.query(`
          INSERT INTO OrderItems (OrderId, ProductId, Quantity, UnitPrice)
          VALUES (@orderId, @productId, @quantity, @unitPrice)
        `);

        // Update product stock
        const stockRequest = new sql.Request(transaction);
        stockRequest.input('productId', sql.Int, item.productId);
        stockRequest.input('quantity', sql.Int, item.quantity);

        await stockRequest.query(`
          UPDATE Products
          SET StockQuantity = StockQuantity - @quantity
          WHERE ProductId = @productId
        `);
      }

      await transaction.commit();
      return { orderId };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Update order status
   */
  static async updateStatus(orderId, status) {
    const query = `
      UPDATE Orders
      SET Status = @status,
          UpdatedAt = GETUTCDATE()
      OUTPUT INSERTED.*
      WHERE OrderId = @orderId
    `;

    const results = await db.query(query, { orderId, status });
    return results[0] || null;
  }

  /**
   * Update payment status
   */
  static async updatePaymentStatus(orderId, paymentStatus) {
    const query = `
      UPDATE Orders
      SET PaymentStatus = @paymentStatus,
          UpdatedAt = GETUTCDATE()
      OUTPUT INSERTED.*
      WHERE OrderId = @orderId
    `;

    const results = await db.query(query, { orderId, paymentStatus });
    return results[0] || null;
  }

  /**
   * Cancel order
   */
  static async cancel(orderId) {
    const pool = await db.connect();
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      // Get order items to restore stock
      const itemsRequest = new sql.Request(transaction);
      itemsRequest.input('orderId', sql.UniqueIdentifier, orderId);

      const itemsResult = await itemsRequest.query(`
        SELECT ProductId, Quantity
        FROM OrderItems
        WHERE OrderId = @orderId
      `);

      // Restore stock for each item
      for (const item of itemsResult.recordset) {
        const stockRequest = new sql.Request(transaction);
        stockRequest.input('productId', sql.Int, item.ProductId);
        stockRequest.input('quantity', sql.Int, item.Quantity);

        await stockRequest.query(`
          UPDATE Products
          SET StockQuantity = StockQuantity + @quantity
          WHERE ProductId = @productId
        `);
      }

      // Update order status
      const orderRequest = new sql.Request(transaction);
      orderRequest.input('orderId', sql.UniqueIdentifier, orderId);

      await orderRequest.query(`
        UPDATE Orders
        SET Status = 'Cancelled',
            UpdatedAt = GETUTCDATE()
        WHERE OrderId = @orderId
      `);

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = Order;