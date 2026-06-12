import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Management.css';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/admin/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert(error.response?.data?.error || 'Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Orders Management</h2>
      </div>

      <div className="orders-grid">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="order-card-admin">
              <div className="order-card-header">
                <div>
                  <h3>Order #{order.id}</h3>
                  <p className="order-user">
                    Customer: {order.userName}
                  </p>
                  <p className="order-date">
                    {formatDate(order.orderDate)}
                  </p>
                </div>

                <p className="order-total">
                  ₹{Number(order.totalAmount).toFixed(2)}
                </p>
              </div>

              <div className="order-items-admin">
                <h4>Items:</h4>

                {order.orderItems &&
                  order.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="order-item-admin"
                    >
                      <span>{item.productName}</span>

                      <span>
                        Qty: {item.quantity} × ₹
                        {Number(item.price).toFixed(2)}
                      </span>

                      <span>
                        ₹
                        {(
                          Number(item.price) *
                          item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <p className="no-data">No orders found</p>
        )}
      </div>
    </div>
  );
};

export default OrdersManagement;