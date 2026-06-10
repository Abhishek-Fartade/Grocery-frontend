import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Management.css';

// Static category options
const STATIC_CATEGORIES = [
  { id: 1, name: 'Grocery' },
  { id: 2, name: 'Fruits' },
  { id: 3, name: 'Vegetables' },
  { id: 4, name: 'Dairy' },
  { id: 5, name: 'Snacks' }
];

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    imageUrl: '',
    categoryId: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Error fetching products');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        categoryId: parseInt(formData.categoryId)
      };

      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.id}`, productData);
      } else {
        await api.post('/admin/products', productData);
      }

      setShowModal(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        quantity: '',
        description: '',
        imageUrl: '',
        categoryId: ''
      });
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      categoryId: product.categoryId.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      await api.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.error || 'Error deleting product');
    }
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Products Management</h2>
        <button className="add-btn" onClick={() => {
          setEditingProduct(null);
          setFormData({
            name: '',
            price: '',
            quantity: '',
            description: '',
            imageUrl: '',
            categoryId: ''
          });
          setShowModal(true);
        }}>
          Add Product
        </button>
      </div>

      <div className="table-container">
        <table className="management-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.categoryName}</td>
                <td>${product.price}</td>
                <td>{product.quantity}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(product)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(product.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category <span style={{color: 'red'}}>*</span></label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {STATIC_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
