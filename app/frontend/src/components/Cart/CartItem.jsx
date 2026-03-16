import React from 'react';
import { useCart } from '../../context/CartContext';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <img 
        src={item.ImageUrl || 'https://via.placeholder.com/100'} 
        alt={item.ProductName}
        className="cart-item-image"
      />
      
      <div className="cart-item-details">
        <h3>{item.ProductName}</h3>
        <p className="cart-item-sku">SKU: {item.SKU}</p>
        <p className="cart-item-price">${item.Price.toFixed(2)}</p>
      </div>

      <div className="cart-item-quantity">
        <button onClick={() => updateQuantity(item.ProductId, item.quantity - 1)}>
          -
        </button>
        <span>{item.quantity}</span>
        <button onClick={() => updateQuantity(item.ProductId, item.quantity + 1)}>
          +
        </button>
      </div>

      <div className="cart-item-total">
        ${(item.Price * item.quantity).toFixed(2)}
      </div>

      <button 
        onClick={() => removeFromCart(item.ProductId)}
        className="cart-item-remove"
      >
        ✕
      </button>
    </div>
  );
};

export default CartItem;