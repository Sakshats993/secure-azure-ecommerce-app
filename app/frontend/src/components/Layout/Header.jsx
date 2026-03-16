import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Header.css';

const Header = () => {
  const { isAuthenticated, user, login, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          🔐 Secure E-Commerce
        </Link>
        
        <nav className="nav">
          <Link to="/products">Products</Link>
          <Link to="/cart" className="cart-link">
            🛒 Cart {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/profile">Profile</Link>
              <Link to="/orders">Orders</Link>
              <button onClick={logout} className="btn-logout">Logout</button>
            </>
          ) : (
            <button onClick={login} className="btn-login">Login</button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;