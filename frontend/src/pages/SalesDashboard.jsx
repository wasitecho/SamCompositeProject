import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SalesDashboard = () => {
  const [stats, setStats] = useState({
    availableProductDetails: 0,
    availableSeries: 0,
    availableThicknesses: 0,
    availableSizes: 0,
    myQuotations: 0,
    pendingQuotations: 0,
    totalQuotations: 0
  });
  const [loading, setLoading] = useState(true);
  
  const { user, logout, isSales } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSales()) {
      navigate('/login');
      return;
    }
    
    // Load dashboard stats
    loadStats();
  }, [isSales, navigate]);

  const loadStats = async () => {
    try {
      // In a real app, you'd have dedicated stats endpoints
      // For now, we'll just set some mock data for available product details
      setStats({
        availableProductDetails: 45,
        availableSeries: 12,
        availableThicknesses: 15,
        availableSizes: 8,
        myQuotations: 12,
        pendingQuotations: 3,
        totalQuotations: 25
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
                <h1 className="h3 mb-0">Sales Dashboard</h1>
                <p className="text-muted">Welcome back, {user?.username}</p>
              </div>
              <div className="text-end">
                <span className="badge bg-info fs-6">Sales</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="row mb-4">
              <div className="col-md-3 mb-3">
                <div className="card bg-primary text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="card-title">{stats.availableProductDetails}</h4>
                        <p className="card-text">Available Product Details</p>
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
                        <h4 className="card-title">{stats.availableSeries}</h4>
                        <p className="card-text">Available Series</p>
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
                        <h4 className="card-title">{stats.availableThicknesses}</h4>
                        <p className="card-text">Available Thicknesses</p>
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
                        <h4 className="card-title">{stats.availableSizes}</h4>
                        <p className="card-text">Available Sizes</p>
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
                        <h4 className="card-title">{stats.myQuotations}</h4>
                        <p className="card-text">My Quotations</p>
                      </div>
                      <div className="align-self-center">
                        <i className="fas fa-file-invoice fa-2x"></i>
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
                        <i className="fas fa-chart-line fa-2x"></i>
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
                    <h5 className="card-title mb-0">Sales Actions</h5>
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
                            Browse Sheets
                          </button>
                        </div>
                      </div>
                      
                      <div className="col-md-3 mb-3">
                        <div className="d-grid">
                          <button 
                            className="btn btn-outline-success"
                            onClick={() => navigate('/sheets')}
                          >
                            <i className="fas fa-calculator me-2"></i>
                            Create Quotation
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
                            My Quotations
                          </button>
                        </div>
                      </div>
                      
                      <div className="col-md-3 mb-3">
                        <div className="d-grid">
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={() => navigate('/cart')}
                          >
                            <i className="fas fa-shopping-cart me-2"></i>
                            View Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Quotations */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Recent Quotations</h5>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>#001</td>
                            <td><span className="badge bg-primary">Full Sheets</span></td>
                            <td>Acrylic Sheet</td>
                            <td>10</td>
                            <td>$450.00</td>
                            <td>2024-01-15</td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary me-1">
                                <i className="fas fa-eye"></i>
                              </button>
                              <button className="btn btn-sm btn-outline-success">
                                <i className="fas fa-download"></i>
                              </button>
                            </td>
                          </tr>
                          
                          <tr>
                            <td>#002</td>
                            <td><span className="badge bg-success">Cut-to-Size</span></td>
                            <td>Polycarbonate Sheet</td>
                            <td>5</td>
                            <td>$320.00</td>
                            <td>2024-01-14</td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary me-1">
                                <i className="fas fa-eye"></i>
                              </button>
                              <button className="btn btn-sm btn-outline-success">
                                <i className="fas fa-download"></i>
                              </button>
                            </td>
                          </tr>
                          
                          <tr>
                            <td>#003</td>
                            <td><span className="badge bg-primary">Full Sheets</span></td>
                            <td>PVC Sheet</td>
                            <td>8</td>
                            <td>$280.00</td>
                            <td>2024-01-13</td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary me-1">
                                <i className="fas fa-eye"></i>
                              </button>
                              <button className="btn btn-sm btn-outline-success">
                                <i className="fas fa-download"></i>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Summary */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Product Details Overview</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className="card border-primary">
                          <div className="card-body">
                            <div className="d-flex align-items-center">
                              <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                                <i className="fas fa-clipboard-list text-primary fa-lg"></i>
                              </div>
                              <div>
                                <h6 className="card-title mb-1">Product Series Available</h6>
                                <p className="card-text text-muted mb-2">View all available product series for quotations</p>
                                <small className="text-muted">Sales can view but not modify series</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <div className="card border-success">
                          <div className="card-body">
                            <div className="d-flex align-items-center">
                              <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                                <i className="fas fa-calculator text-success fa-lg"></i>
                              </div>
                              <div>
                                <h6 className="card-title mb-1">Quotation Capabilities</h6>
                                <p className="card-text text-muted mb-2">Create, save, and manage quotations</p>
                                <small className="text-muted">Full access to quotation features</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="alert alert-info mt-3">
                      <div className="d-flex align-items-start">
                        <i className="fas fa-info-circle me-2 mt-1"></i>
                        <div>
                          <h6 className="alert-heading mb-1">Sales User Permissions</h6>
                          <p className="mb-2">As a Sales user, you have access to:</p>
                          <ul className="mb-0 small">
                            <li>View all available product details (series, thicknesses, sizes, prices)</li>
                            <li>Create and save quotations for both Full Sheets and Cut-to-Size</li>
                            <li>Add items to cart and manage quotation history</li>
                            <li>View pending quotations and track quotation status</li>
                          </ul>
                          <p className="mb-0 mt-2 small text-muted">
                            <strong>Note:</strong> Product specifications (series, thickness, size, price) can only be modified by Admin users.
                          </p>
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
    </div>
  );
};

export default SalesDashboard;
