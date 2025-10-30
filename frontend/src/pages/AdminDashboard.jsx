import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProductDetails: 0,
    totalSeries: 0,
    totalThicknesses: 0,
    totalSizes: 0,
    totalPrices: 0,
    pendingQuotations: 0,
    totalQuotations: 0
  });
  const [loading, setLoading] = useState(true);
  
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login');
      return;
    }
    
    // Load dashboard stats
    loadStats();
  }, [isAdmin, navigate]);

  const loadStats = async () => {
    try {
      // In a real app, you'd have dedicated stats endpoints
      // For now, we'll just set some mock data for product details
      setStats({
        totalProductDetails: 45,
        totalSeries: 12,
        totalThicknesses: 15,
        totalSizes: 8,
        totalPrices: 120,
        pendingQuotations: 8,
        totalQuotations: 45
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h3 mb-0">Admin Dashboard</h1>
                <p className="text-muted">Welcome back, {user?.username}</p>
              </div>
              <div className="text-end">
                <span className="badge bg-success fs-6">Admin</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="row mb-4">
              <div className="col-md-3 mb-3">
                <div className="card bg-primary text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="card-title">{stats.totalProductDetails}</h4>
                        <p className="card-text">Product Details</p>
                      </div>
                      <div className="align-self-center">
                        <i className="fas fa-clipboard-list fa-2x"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3 mb-3">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="card-title">{stats.totalSeries}</h4>
                        <p className="card-text">Series</p>
                      </div>
                      <div className="align-self-center">
                        <i className="fas fa-layer-group fa-2x"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3 mb-3">
                <div className="card bg-info text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="card-title">{stats.totalThicknesses}</h4>
                        <p className="card-text">Thicknesses</p>
                      </div>
                      <div className="align-self-center">
                        <i className="fas fa-ruler fa-2x"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card bg-warning text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="card-title">{stats.totalSizes}</h4>
                        <p className="card-text">Sizes</p>
                      </div>
                      <div className="align-self-center">
                        <i className="fas fa-expand-arrows-alt fa-2x"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Row of Stats */}
            <div className="row mb-4">
              <div className="col-md-4 mb-3">
                <div className="card bg-secondary text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="card-title">{stats.totalPrices}</h4>
                        <p className="card-text">Price Configurations</p>
                      </div>
                      <div className="align-self-center">
                        <i className="fas fa-dollar-sign fa-2x"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="card bg-danger text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="card-title">{stats.pendingQuotations}</h4>
                        <p className="card-text">Pending Quotations</p>
                      </div>
                      <div className="align-self-center">
                        <i className="fas fa-clock fa-2x"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4 mb-3">
                <div className="card bg-dark text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="card-title">{stats.totalQuotations}</h4>
                        <p className="card-text">Total Quotations</p>
                      </div>
                      <div className="align-self-center">
                        <i className="fas fa-file-invoice fa-2x"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Product Details Management</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-3 mb-3">
                        <div className="d-grid">
                          <button 
                            className="btn btn-outline-primary"
                            onClick={() => navigate('/sheets')}
                          >
                            <i className="fas fa-layer-group me-2"></i>
                            Manage Sheets
                          </button>
                        </div>
                      </div>
                      
                      <div className="col-md-3 mb-3">
                        <div className="d-grid">
                          <button 
                            className="btn btn-outline-success"
                            onClick={() => navigate('/categories')}
                          >
                            <i className="fas fa-th-large me-2"></i>
                            View Categories
                          </button>
                        </div>
                      </div>
                      
                      <div className="col-md-3 mb-3">
                        <div className="d-grid">
                          <button 
                            className="btn btn-outline-info"
                            onClick={() => navigate('/quotations-history')}
                          >
                            <i className="fas fa-history me-2"></i>
                            View Quotations
                          </button>
                        </div>
                      </div>
                      
                      <div className="col-md-3 mb-3">
                        <div className="d-grid">
                          <button 
                            className="btn btn-outline-warning"
                            onClick={() => navigate('/add-product')}
                          >
                            <i className="fas fa-plus me-2"></i>
                            Add Categories
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Product Details Activity */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Recent Product Details Activity</h5>
                  </div>
                  <div className="card-body">
                    <div className="list-group list-group-flush">
                      <div className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">New series added</h6>
                          <small className="text-muted">Premium series added to Acrylic grade</small>
                        </div>
                        <small className="text-muted">2 hours ago</small>
                      </div>
                      
                      <div className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">Price configuration updated</h6>
                          <small className="text-muted">3mm thickness pricing updated for Polycarbonate</small>
                        </div>
                        <small className="text-muted">4 hours ago</small>
                      </div>
                      
                      <div className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">New size added</h6>
                          <small className="text-muted">1500x3000mm size added to available options</small>
                        </div>
                        <small className="text-muted">6 hours ago</small>
                      </div>

                      <div className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">Thickness specification added</h6>
                          <small className="text-muted">12mm thickness added to system</small>
                        </div>
                        <small className="text-muted">1 day ago</small>
                      </div>

                      <div className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">Quotation created</h6>
                          <small className="text-muted">Cut-to-size quotation for PVC sheet</small>
                        </div>
                        <small className="text-muted">1 day ago</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
