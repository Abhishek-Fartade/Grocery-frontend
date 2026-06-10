import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import api from '../../services/api';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

useEffect(() => {
  const fetchOrders = async () => {
    try {
      const response = await api.get('/user/orders');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  fetchOrders();

  if (location.state?.orderPlaced) {
    alert('Order placed successfully!');
  }
}, [location.state?.orderPlaced]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Loading orders...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="order-history-container">
        <h2>Order History</h2>
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You have no orders yet.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">{formatDate(order.orderDate)}</p>
                  </div>
                  <p className="order-total">${parseFloat(order.totalAmount).toFixed(2)}</p>
                </div>
                <div className="order-items">
                  <h4>Items:</h4>
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="order-item">
                      <span>{item.productName}</span>
                      <span>Qty: {item.quantity} x ${parseFloat(item.price).toFixed(2)}</span>
                      <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OrderHistory;
