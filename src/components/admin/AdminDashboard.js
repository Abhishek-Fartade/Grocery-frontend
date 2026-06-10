import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProductsManagement from './ProductsManagement';
import CategoriesManagement from './CategoriesManagement';
import OrdersManagement from './OrdersManagement';
import UsersManagement from './UsersManagement';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('products');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'products':
        return <ProductsManagement />;
      case 'categories':
        return <CategoriesManagement />;
      case 'orders':
        return <OrdersManagement />;
      case 'users':
        return <UsersManagement />;
      default:
        return <ProductsManagement />;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <h2>Admin Dashboard</h2>
        <nav className="admin-nav">
          <button
            className={activeSection === 'products' ? 'active' : ''}
            onClick={() => setActiveSection('products')}
          >
            Products
          </button>
          <button
            className={activeSection === 'categories' ? 'active' : ''}
            onClick={() => setActiveSection('categories')}
          >
            Categories
          </button>
          <button
            className={activeSection === 'orders' ? 'active' : ''}
            onClick={() => setActiveSection('orders')}
          >
            Orders
          </button>
          <button
            className={activeSection === 'users' ? 'active' : ''}
            onClick={() => setActiveSection('users')}
          >
            Users
          </button>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
