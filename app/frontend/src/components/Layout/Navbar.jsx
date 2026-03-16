import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar-secondary">
      <div className="navbar-container">
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/help">Help</Link>
        <Link to="/security">Security</Link>
      </div>
    </nav>
  );
};

export default Navbar;