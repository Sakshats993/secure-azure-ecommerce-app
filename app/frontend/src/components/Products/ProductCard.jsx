import React from 'react';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
    alert(`${product.ProductName} added to cart!`);
  };

  return (
    <div className="product-card">
      <img 
        src={product.ImageUrl || 'https://via.placeholder.com/300'} 
        alt={product.ProductName}
        className="product-image"
      />
      <div className="product-info">
        <h3 className="product-name">{product.ProductName}</h3>
        <p className="product-category">{product.CategoryName}</p>
        <p className="product-description">{product.Description?.substring(0, 100)}...</p>
        <div className="product-footer">
          <span className="product-price">${product.Price.toFixed(2)}</span>
          <span className="product-stock">
            {product.StockQuantity > 0 ? `${product.StockQuantity} in stock` : 'Out of stock'}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.StockQuantity === 0}
          className="add-to-cart-btn"
        >
          {product.StockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;