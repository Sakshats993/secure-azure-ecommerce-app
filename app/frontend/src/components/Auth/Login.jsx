import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../../utils/msalConfig';
import './Login.css';

const Login = () => {
  const { instance } = useMsal();

  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🔐 Secure E-Commerce</h1>
          <p>Sign in to continue shopping</p>
        </div>
        
        <div className="login-body">
          <button onClick={handleLogin} className="login-button">
            Sign in with Microsoft
          </button>
          
          <div className="login-features">
            <h3>Why sign in?</h3>
            <ul>
              <li>✓ Track your orders</li>
              <li>✓ Save your cart</li>
              <li>✓ Faster checkout</li>
              <li>✓ Exclusive deals</li>
            </ul>
          </div>
        </div>

        <div className="security-info">
          <p>🔒 Your data is protected with Azure AD B2C</p>
        </div>
      </div>
    </div>
  );
};

export default Login;