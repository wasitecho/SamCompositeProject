import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../services/products';

function AddProductPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    price: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!form.name.trim()) {
      errors.name = 'Product name is required';
    }
    
    if (!form.category.trim()) {
      errors.category = 'Category is required';
    }
    
    if (!form.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!form.price || form.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!validateForm()) {
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: form.name.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        price: Number(form.price)
      };
      await createProduct(payload);
      setSuccessMsg('Product added successfully! Redirecting...');
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Failed to add product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0 fw-bold">➕ Add New Product</h4>
              <p className="mb-0 small opacity-75">Add a new product to your inventory</p>
            </div>
            <div className="card-body p-4">
              {errorMsg && (
                <div className="alert alert-danger" role="alert">
                  <strong>❌ Error:</strong> {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="alert alert-success" role="alert">
                  <strong>✅ Success:</strong> {successMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="row g-4">
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label fw-semibold">
                    Product Name <span className="text-danger">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g., Polycarbonate Sheet"
                  />
                  {validationErrors.name && (
                    <div className="invalid-feedback">{validationErrors.name}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label htmlFor="category" className="form-label fw-semibold">
                    Category <span className="text-danger">*</span>
                  </label>
                  <input
                    id="category"
                    name="category"
                    className={`form-control ${validationErrors.category ? 'is-invalid' : ''}`}
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g., Sheet, Rod, Tubing"
                  />
                  {validationErrors.category && (
                    <div className="invalid-feedback">{validationErrors.category}</div>
                  )}
                </div>

                <div className="col-12">
                  <label htmlFor="description" className="form-label fw-semibold">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className={`form-control ${validationErrors.description ? 'is-invalid' : ''}`}
                    rows="4"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Provide a detailed description of the product..."
                  />
                  {validationErrors.description && (
                    <div className="invalid-feedback">{validationErrors.description}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label htmlFor="price" className="form-label fw-semibold">
                    Price <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0.01"
                      className={`form-control ${validationErrors.price ? 'is-invalid' : ''}`}
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                    {validationErrors.price && (
                      <div className="invalid-feedback">{validationErrors.price}</div>
                    )}
                  </div>
                </div>

                <div className="col-12">
                  <div className="d-flex gap-3">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg px-4" 
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          💾 Save Product
                        </>
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary btn-lg px-4"
                      onClick={() => navigate('/products')}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProductPage;


