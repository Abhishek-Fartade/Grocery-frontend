import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const checkoutRequest = {
        cartItems: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      await api.post('/user/checkout', checkoutRequest);
      
      clearCart();
      navigate('/orders', { state: { orderPlaced: true } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="checkout-container">
        <h2>Checkout</h2>
        <div className="checkout-content">
          <div className="order-review">
            <h3>Order Review</h3>
            {cartItems.map((item) => (
              <div key={item.id} className="review-item">
                <div>
                  <h4>{item.name}</h4>
                  <p>Quantity: {item.quantity} x ${item.price}</p>
                </div>
                <p className="review-item-total">
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
            <div className="review-total">
              <span>Total:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
          <div className="checkout-actions">
            {error && <div className="error-message">{error}</div>}
            <button
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={loading || cartItems.length === 0}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
            <button
              className="cancel-btn"
              onClick={() => navigate('/cart')}
              disabled={loading}
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
