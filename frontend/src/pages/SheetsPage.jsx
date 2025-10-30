import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { categoriesApi } from '../services/categories';
import { gradesApi } from '../services/grades';

function SheetsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isSales } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Categories and Grades modal state
  const [grades, setGrades] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newGradeName, setNewGradeName] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingGrades, setLoadingGrades] = useState(false);

  useEffect(() => {
    // Check if user is authenticated when component loads
    if (!isAuthenticated()) {
      setShowLoginPrompt(true);
      return;
    }

    // If authenticated, load categories
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/categories?type=sheet');
        setCategories(res.data || []);
      } catch (e) {
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAuthenticated]);

  // Load categories function
  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await api.get('/categories?type=sheet');
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Load grades function
  const loadGrades = async (categoryId) => {
    try {
      setLoadingGrades(true);
      const response = await gradesApi.getByCategory(categoryId);
      setGrades(response.data);
    } catch (error) {
      console.error('Error loading grades:', error);
    } finally {
      setLoadingGrades(false);
    }
  };

  // Category modal handlers
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      await api.post('/categories', { name: newCategoryName.trim(), type: 'sheet' });
      setNewCategoryName('');
      setShowCategoryModal(false);
      loadCategories(); // Reload categories
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleOpenGradeModal = (category) => {
    setSelectedCategory(category);
    setShowGradeModal(true);
    loadGrades(category.id);
  };

  // Grade modal handlers
  const handleAddGrade = async () => {
    if (!newGradeName.trim() || !selectedCategory) return;
    
    try {
      await gradesApi.create(selectedCategory.id, { typeCode: newGradeName.trim() });
      setNewGradeName('');
      loadGrades(selectedCategory.id); // Reload grades for this category
    } catch (error) {
      console.error('Error adding grade:', error);
    }
  };

  // Handle login redirect
  const handleLogin = () => {
    navigate('/login', { 
      state: { 
        from: '/sheets',
        message: 'Please login to access the Sheets section' 
      } 
    });
  };

  // If not authenticated, show login prompt
  if (showLoginPrompt) {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <div className="mb-4">
                  <i className="fas fa-lock fa-3x text-primary"></i>
                </div>
                <h3 className="card-title mb-3">Authentication Required</h3>
                <p className="card-text text-muted mb-4">
                  You need to login to access the Sheets section. This area requires authentication for both Admin and Sales users.
                </p>
                <div className="d-flex gap-2 justify-content-center">
                  <button 
                    className="btn btn-primary px-4"
                    onClick={handleLogin}
                  >
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Login
                  </button>
                  <button 
                    className="btn btn-outline-secondary px-4"
                    onClick={() => navigate('/')}
                  >
                    <i className="fas fa-home me-2"></i>
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="mb-1">Sheets</h2>
          <p className="text-muted mb-0">
            Welcome {isAdmin() ? 'Admin' : 'Sales'} user! Browse and manage sheet categories.
          </p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          {isAdmin() && (
            <button
              className="btn btn-primary"
              onClick={() => setShowCategoryModal(true)}
            >
              <i className="fas fa-plus me-2"></i>
              📁 Manage Categories
            </button>
          )}
          <span className={`badge fs-6 ${isAdmin() ? 'bg-danger' : 'bg-info'}`}>
            {isAdmin() ? 'Admin Access' : 'Sales Access'}
          </span>
        </div>
      </div>
      
      {loading && (
        <div className="d-flex justify-content-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}
      
      <div className="row">
        {(categories || []).map(cat => (
          <div key={cat.id} className="col-md-6 col-lg-4 mb-3">
            <div className="card h-100 shadow-sm hover-card">
              <div className="card-body d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                    <i className="fas fa-layer-group text-primary fa-lg"></i>
                  </div>
                  <div>
                    <h5 className="card-title mb-0">{cat.name}</h5>
                    <small className="text-muted">Category</small>
                  </div>
                </div>
                <div className="mt-auto">
                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={() => navigate(`/categories/${cat.id}`)}
                  >
                    <i className="fas fa-arrow-right me-2"></i>
                    View Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {(!categories || categories.length === 0) && !loading && !error && (
          <div className="col-12">
            <div className="text-center py-5">
              <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
              <h4 className="text-muted">No Categories Available</h4>
              <p className="text-muted">No sheet categories have been added yet.</p>
            </div>
          </div>
        )}
      </div>

      {/* Categories Modal */}
      {showCategoryModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">📁 Manage Categories</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCategoryModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Add New Category */}
                <div className="mb-4">
                  <h6>Add New Category</h6>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={handleAddCategory}
                      disabled={!newCategoryName.trim()}
                    >
                      Add Category
                    </button>
                  </div>
                </div>

                {/* Categories List */}
                <div>
                  <h6>Existing Categories</h6>
                  {loadingCategories ? (
                    <div className="text-center">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="list-group">
                      {categories.map((category) => (
                        <div key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                          <span className="fw-semibold">{category.name}</span>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleOpenGradeModal(category)}
                          >
                            📋 Manage Grades
                          </button>
                        </div>
                      ))}
                      {categories.length === 0 && (
                        <div className="text-muted text-center py-3">
                          No categories found. Add one above.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCategoryModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grades Modal */}
      {showGradeModal && selectedCategory && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">📋 Manage Grades - {selectedCategory.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowGradeModal(false);
                    setSelectedCategory(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {/* Add New Grade */}
                <div className="mb-4">
                  <h6>Add New Grade</h6>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter grade name"
                      value={newGradeName}
                      onChange={(e) => setNewGradeName(e.target.value)}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={handleAddGrade}
                      disabled={!newGradeName.trim()}
                    >
                      Add Grade
                    </button>
                  </div>
                </div>

                {/* Grades List */}
                <div>
                  <h6>Existing Grades</h6>
                  {loadingGrades ? (
                    <div className="text-center">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="list-group">
                      {grades.map((grade) => (
                        <div key={grade.id} className="list-group-item">
                          <span className="fw-semibold">{grade.typeCode}</span>
                        </div>
                      ))}
                      {grades.length === 0 && (
                        <div className="text-muted text-center py-3">
                          No grades found. Add one above.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowGradeModal(false);
                    setSelectedCategory(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SheetsPage;


