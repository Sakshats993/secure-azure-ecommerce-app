const db = require('../config/database');

class Product {
  /**
   * Get all products with filtering
   */
  static async findAll(filters = {}) {
    let query = `
      SELECT p.ProductId, p.ProductName, p.Description, p.Price, 
             p.StockQuantity, p.ImageUrl, p.SKU, p.IsActive,
             c.CategoryName, c.CategoryId
      FROM Products p
      LEFT JOIN Categories c ON p.CategoryId = c.CategoryId
      WHERE p.IsActive = 1
    `;

    const params = {};

    if (filters.categoryId) {
      query += ' AND p.CategoryId = @categoryId';
      params.categoryId = filters.categoryId;
    }

    if (filters.search) {
      query += ' AND (p.ProductName LIKE @search OR p.Description LIKE @search)';
      params.search = `%${filters.search}%`;
    }

    if (filters.minPrice) {
      query += ' AND p.Price >= @minPrice';
      params.minPrice = filters.minPrice;
    }

    if (filters.maxPrice) {
      query += ' AND p.Price <= @maxPrice';
      params.maxPrice = filters.maxPrice;
    }

    query += ' ORDER BY p.ProductId';

    if (filters.limit) {
      query += ' OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
      params.offset = filters.offset || 0;
      params.limit = filters.limit;
    }

    return await db.query(query, params);
  }

  /**
   * Find product by ID
   */
  static async findById(productId) {
    const query = `
      SELECT p.*, c.CategoryName
      FROM Products p
      LEFT JOIN Categories c ON p.CategoryId = c.CategoryId
      WHERE p.ProductId = @productId AND p.IsActive = 1
    `;

    const results = await db.query(query, { productId });
    return results[0] || null;
  }

  /**
   * Create new product
   */
  static async create(productData) {
    const query = `
      INSERT INTO Products (CategoryId, ProductName, Description, Price, StockQuantity, ImageUrl, SKU)
      OUTPUT INSERTED.*
      VALUES (@categoryId, @productName, @description, @price, @stockQuantity, @imageUrl, @sku)
    `;

    const results = await db.query(query, productData);
    return results[0];
  }

  /**
   * Update product
   */
  static async update(productId, productData) {
    const query = `
      UPDATE Products
      SET ProductName = @productName,
          Description = @description,
          Price = @price,
          StockQuantity = @stockQuantity,
          ImageUrl = @imageUrl,
          CategoryId = @categoryId,
          UpdatedAt = GETUTCDATE()
      OUTPUT INSERTED.*
      WHERE ProductId = @productId
    `;

    const results = await db.query(query, { ...productData, productId });
    return results[0] || null;
  }

  /**
   * Update stock quantity
   */
  static async updateStock(productId, quantity) {
    const query = `
      UPDATE Products
      SET StockQuantity = StockQuantity + @quantity,
          UpdatedAt = GETUTCDATE()
      OUTPUT INSERTED.*
      WHERE ProductId = @productId
    `;

    const results = await db.query(query, { productId, quantity });
    return results[0] || null;
  }

  /**
   * Delete product (soft delete)
   */
  static async delete(productId) {
    const query = `
      UPDATE Products
      SET IsActive = 0,
          UpdatedAt = GETUTCDATE()
      WHERE ProductId = @productId
    `;

    await db.query(query, { productId });
    return true;
  }

  /**
   * Check if product has sufficient stock
   */
  static async checkStock(productId, quantity) {
    const query = `
      SELECT StockQuantity
      FROM Products
      WHERE ProductId = @productId AND IsActive = 1
    `;

    const results = await db.query(query, { productId });
    
    if (!results[0]) {
      return false;
    }

    return results[0].StockQuantity >= quantity;
  }
}

module.exports = Product;