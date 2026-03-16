import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../services/product.service';
import { useCart } from '../../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productService.getProductById(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`${quantity} x ${product.ProductName} added to cart!`);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="product-detail-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back to Products
      </button>

      <div className="product-detail">
        <div className="product-image-section">
          <img 
            src={product.ImageUrl || 'https://via.placeholder.com/500'} 
            alt={product.ProductName}
          />
        </div>

        <div className="product-info-section">
          <span className="product-category">{product.CategoryName}</span>
          <h1>{product.ProductName}</h1>
          <div className="product-price">${product.Price.toFixed(2)}</div>
          
          <div className="product-stock">
            {product.StockQuantity > 0 ? (
              <span className="in-stock">✓ In Stock ({product.StockQuantity} available)</span>
            ) : (
              <span className="out-of-stock">✗ Out of Stock</span>
            )}
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.Description}</p>
          </div>

          <div className="product-sku">
            <strong>SKU:</strong> {product.SKU}
          </div>

          <div className="quantity-selector">
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input 
                type="number" 
                value={quantity} 
                min="1" 
                max={product.StockQuantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <button 
                onClick={() => setQuantity(Math.min(product.StockQuantity, quantity + 1))}
                disabled={quantity >= product.StockQuantity}
              >
                +
              </button>
            </div>
          </div>

          <button 
            onClick={handleAddToCart} 
            disabled={product.StockQuantity === 0}
            className="add-to-cart-btn-large"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;