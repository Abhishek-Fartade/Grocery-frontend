import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import UserLogin from './components/user/UserLogin';
import UserRegister from './components/user/UserRegister';
import Home from './components/user/Home';
import ProductDetails from './components/user/ProductDetails';
import Cart from './components/user/Cart';
import Checkout from './components/user/Checkout';
import OrderHistory from './components/user/OrderHistory';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* User Routes */}
            <Route path="/login" element={<UserLogin />} />
            <Route path="/register" element={<UserRegister />} />
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute role="USER">
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute role="USER">
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute role="USER">
                  <OrderHistory />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
