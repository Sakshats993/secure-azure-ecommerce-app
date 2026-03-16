import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './utils/msalConfig';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ProductList from './components/Products/ProductList';
import Cart from './components/Cart/Cart';
import ProtectedRoute from './components/Auth/ProtectedRoute';

import './App.css';

const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="app">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<ProductList />} />
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <div>Profile Page (TODO)</div>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/orders" 
                    element={
                      <ProtectedRoute>
                        <div>Orders Page (TODO)</div>
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </MsalProvider>
  );
}

export default App;