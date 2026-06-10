import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🛒 Supermarket
        </Link>
        <div className="navbar-menu">
          {user ? (
            <>
              {user.role === 'USER' && (
                <>
                  <Link to="/" className="navbar-link">Home</Link>
                  <Link to="/cart" className="navbar-link">
                    Cart
                    {getCartItemsCount() > 0 && (
                      <span className="cart-badge">{getCartItemsCount()}</span>
                    )}
                  </Link>
                  <Link to="/orders" className="navbar-link">Orders</Link>
                </>
              )}
              <span className="navbar-user">Welcome, {user.name}</span>
              <button onClick={handleLogout} className="navbar-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
