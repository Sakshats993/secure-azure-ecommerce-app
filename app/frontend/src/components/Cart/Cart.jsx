import React from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Navigate to checkout page
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/products')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.ProductId} className="cart-item">
            <img src={item.ImageUrl || 'https://via.placeholder.com/100'} alt={item.ProductName} />
            <div className="item-details">
              <h3>{item.ProductName}</h3>
              <p>${item.Price.toFixed(2)}</p>
            </div>
            <div className="item-quantity">
              <button onClick={() => updateQuantity(item.ProductId, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.ProductId, item.quantity + 1)}>+</button>
            </div>
            <div className="item-total">
              ${(item.Price * item.quantity).toFixed(2)}
            </div>
            <button onClick={() => removeFromCart(item.ProductId)} className="remove-btn">
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h2>Total: ${getTotal().toFixed(2)}</h2>
        <button onClick={clearCart} className="clear-btn">Clear Cart</button>
        <button onClick={handleCheckout} className="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;