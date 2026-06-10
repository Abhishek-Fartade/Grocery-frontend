import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.quantity >= quantity) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      alert(`${quantity} x ${product.name} added to cart!`);
      navigate('/cart');
    } else {
      alert('Insufficient stock');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Loading...</div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="error">Product not found</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="product-details-container">
        <Link to="/" className="back-link">← Back to Products</Link>
        <div className="product-details">
          <div className="product-image-large">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} />
            ) : (
              <div className="placeholder-image-large">🛒</div>
            )}
          </div>
          <div className="product-info-large">
            <h1>{product.name}</h1>
            <p className="category">Category: {product.categoryName}</p>
            <p className="price">${product.price}</p>
            <p className="description">{product.description || 'No description available'}</p>
            <p className="stock">
              {product.quantity > 0 ? `In Stock: ${product.quantity}` : 'Out of Stock'}
            </p>
            {product.quantity > 0 && (
              <div className="quantity-selector">
                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.quantity, parseInt(e.target.value) || 1)))}
                />
              </div>
            )}
            <button
              className="add-to-cart-large-btn"
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
            >
              {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
