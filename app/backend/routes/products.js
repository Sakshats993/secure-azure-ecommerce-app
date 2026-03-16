const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');
const sql = require('mssql');

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT p.ProductId, p.ProductName, p.Description, p.Price, 
             p.StockQuantity, p.ImageUrl, p.SKU, c.CategoryName
      FROM Products p
      LEFT JOIN Categories c ON p.CategoryId = c.CategoryId
      WHERE p.IsActive = 1
    `;
    
    const params = {};
    
    if (category) {
      query += ' AND c.CategoryName = @category';
      params.category = category;
    }
    
    if (search) {
      query += ' AND (p.ProductName LIKE @search OR p.Description LIKE @search)';
      params.search = `%${search}%`;
    }
    
    query += ` ORDER BY p.ProductId OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;
    params.offset = parseInt(offset);
    params.limit = parseInt(limit);
    
    const products = await db.query(query, params);
    
    logger.info(`Retrieved ${products.length} products`);
    res.json({ success: true, data: products });
  } catch (error) {
    logger.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT p.*, c.CategoryName
      FROM Products p
      LEFT JOIN Categories c ON p.CategoryId = c.CategoryId
      WHERE p.ProductId = @id AND p.IsActive = 1
    `;
    
    const products = await db.query(query, { id });
    
    if (products.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    res.json({ success: true, data: products[0] });
  } catch (error) {
    logger.error('Error fetching product:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});

// Get categories
router.get('/categories/all', async (req, res) => {
  try {
    const query = 'SELECT * FROM Categories WHERE IsActive = 1';
    const categories = await db.query(query);
    
    res.json({ success: true, data: categories });
  } catch (error) {
    logger.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

module.exports = router;