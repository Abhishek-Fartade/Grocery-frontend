import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProductsByCategory(selectedCategory);
    } else {
      fetchProducts();
    }
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProductsByCategory = async (categoryId) => {
    try {
      const response = await api.get(`/api/products/category/${categoryId}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products by category:', error);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddToCart = (product) => {
    if (product.quantity > 0) {
      addToCart(product);
      showNotification(`${product.name} added to cart! ✨`, 'success');
    } else {
      showNotification('Product is out of stock', 'error');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading amazing products...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="sidebar">
          <h3>Categories</h3>
          <button
            className={selectedCategory === null ? 'category-btn active' : 'category-btn'}
            onClick={() => setSelectedCategory(null)}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={selectedCategory === category.id ? 'category-btn active' : 'category-btn'}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className="products-container">
          <h2>Products</h2>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <Link to={`/product/${product.id}`}>
                  <div className="product-image">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} />
                    ) : (
                      <div className="placeholder-image">🛒</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-category">{product.categoryName}</p>
                    <p className="product-price">${product.price}</p>
                    <p className={`product-stock ${product.quantity === 0 ? 'out-of-stock' : ''}`}>
                      {product.quantity > 0 ? `In Stock: ${product.quantity} units` : 'Out of Stock'}
                    </p>
                  </div>
                </Link>
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.quantity === 0}
                >
                  {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            ))}
          </div>
          {products.length === 0 && (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Check back later for new products!</p>
            </div>
          )}
        </div>
      </div>
      {notification && (
        <div className={`toast toast-${notification.type}`}>
          {notification.message}
        </div>
      )}
    </>
  );
};

export default Home;
