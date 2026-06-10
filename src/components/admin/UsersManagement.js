import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Management.css';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error fetching users');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Users Management</h2>
      </div>

      <div className="table-container">
        <table className="management-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="no-data">No users found</p>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;
