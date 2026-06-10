import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Management.css';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Error fetching categories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory.id}`, formData);
      } else {
        await api.post('/admin/categories', formData);
      }

      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }
    try {
      await api.delete(`/admin/categories/${id}`);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.error || 'Error deleting category');
    }
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Categories Management</h2>
        <button className="add-btn" onClick={() => {
          setEditingCategory(null);
          setFormData({ name: '', description: '' });
          setShowModal(true);
        }}>
          Add Category
        </button>
      </div>

      <div className="table-container">
        <table className="management-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.description || '-'}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(category)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(category.id)}>
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
            <h3>{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
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
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

export default CategoriesManagement;
