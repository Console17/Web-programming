import { useState, useEffect } from 'react';
import { categoriesAPI } from '../api/categories';
import LoadingSpinner from './LoadingSpinner';
import Modal from './Modal';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, category: null });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesAPI.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      setSubmitting(true);
      const category = await categoriesAPI.createCategory(newCategoryName.trim());
      setCategories([category, ...categories]);
      setNewCategoryName('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding category:', error);
      alert(error.response?.data?.message || 'Failed to add category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    if (!editCategoryName.trim() || !editingCategory) return;

    try {
      setSubmitting(true);
      const updated = await categoriesAPI.updateCategory(
        editingCategory._id,
        editCategoryName.trim()
      );
      setCategories(categories.map(cat => 
        cat._id === editingCategory._id ? updated : cat
      ));
      setEditingCategory(null);
      setEditCategoryName('');
    } catch (error) {
      console.error('Error updating category:', error);
      alert(error.response?.data?.message || 'Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (category) => {
    setDeleteModal({ isOpen: true, category });
  };

  const handleDeleteConfirm = async () => {
    try {
      await categoriesAPI.deleteCategory(deleteModal.category._id);
      setCategories(categories.filter(cat => cat._id !== deleteModal.category._id));
      setDeleteModal({ isOpen: false, category: null });
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const startEdit = (category) => {
    setEditingCategory(category);
    setEditCategoryName(category.name);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditCategoryName('');
  };

  const cancelAdd = () => {
    setShowAddForm(false);
    setNewCategoryName('');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="category-management-section">
      <div className="section-header">
        <h3>Category Management ({categories.length})</h3>
        {!showAddForm && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn-primary add-category-btn"
          >
            + Add Category
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="category-form">
          <form onSubmit={handleAddCategory}>
            <div className="form-row">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
                className="category-input"
                disabled={submitting}
                autoFocus
              />
              <button 
                type="submit" 
                className="btn-success save-btn"
                disabled={submitting || !newCategoryName.trim()}
              >
                {submitting ? 'Adding...' : 'Add'}
              </button>
              <button 
                type="button" 
                onClick={cancelAdd}
                className="btn-secondary cancel-btn"
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="no-categories">
          <p>No categories created yet</p>
        </div>
      ) : (
        <div className="categories-list">
          {categories.map((category) => (
            <div key={category._id} className="category-item">
              {editingCategory?._id === category._id ? (
                <form onSubmit={handleEditCategory} className="edit-form">
                  <div className="form-row">
                    <input
                      type="text"
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      className="category-input"
                      disabled={submitting}
                      autoFocus
                    />
                    <button 
                      type="submit" 
                      className="btn-success save-btn"
                      disabled={submitting || !editCategoryName.trim()}
                    >
                      {submitting ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      type="button" 
                      onClick={cancelEdit}
                      className="btn-secondary cancel-btn"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="category-info">
                    <h4 className="category-name">{category.name}</h4>
                    <span className="category-date">
                      Created: {new Date(category.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="category-actions">
                    <button 
                      onClick={() => startEdit(category)}
                      className="btn-secondary edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(category)}
                      className="btn-danger delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, category: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${deleteModal.category?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default CategoryManagement;