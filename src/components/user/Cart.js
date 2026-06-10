import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="cart-container">
          <h2>Shopping Cart</h2>
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <Link to="/" className="continue-shopping">Continue Shopping</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <h2>Shopping Cart</h2>
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p className="item-category">{item.categoryName}</p>
                  <p className="item-price">${item.price} each</p>
                </div>
                <div className="item-controls">
                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <p className="item-total">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Total Items:</span>
              <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <Link to="/" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
