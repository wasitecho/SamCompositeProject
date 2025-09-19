import { useEffect, useMemo, useState } from 'react';
import {
  fetchProducts,
  searchProductsByName,
  fetchProductsByCategory,
  fetchProductsByPriceRange,
  deleteProduct as deleteProductApi
} from '../services/products';
import ProductCard from '../components/ProductCard';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        let data = [];
        if (query.trim()) {
          data = await searchProductsByName(query.trim());
        } else if (category.trim()) {
          data = await fetchProductsByCategory(category.trim());
        } else if (minPrice !== '' && maxPrice !== '') {
          data = await fetchProductsByPriceRange(Number(minPrice), Number(maxPrice));
        } else {
          data = await fetchProducts();
        }
        if (isMounted) setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (isMounted) setErrorMsg(err?.response?.data?.message || 'Failed to load products.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [query, category, minPrice, maxPrice, refreshIndex]);

  const canSearchByPrice = useMemo(() => minPrice !== '' && maxPrice !== '', [minPrice, maxPrice]);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Delete this product?');
    if (!confirm) return;
    try {
      await deleteProductApi(id);
      setRefreshIndex((i) => i + 1);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Failed to delete product.');
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Product Catalog</h2>
          <p className="text-muted mb-0">Browse our comprehensive inventory of industrial plastics</p>
        </div>
        <div className="text-end">
          <span className="badge bg-primary fs-6">{products.length} Products</span>
        </div>
      </div>

      {/* Search and Filter Card */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-light">
          <h6 className="mb-0 fw-semibold">🔍 Search & Filter</h6>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-semibold">Search by Name</label>
              <div className="input-group">
                <span className="input-group-text">🔍</span>
                <input
                  className="form-control"
                  placeholder="Enter product name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold">Category Filter</label>
              <div className="input-group">
                <span className="input-group-text">📂</span>
                <input
                  className="form-control"
                  placeholder="e.g., Sheet, Rod..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={query.trim().length > 0}
                />
              </div>
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-semibold">Min Price</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-control"
                  placeholder="0.00"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  disabled={query.trim().length > 0 || category.trim().length > 0}
                />
              </div>
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-semibold">Max Price</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-control"
                  placeholder="999.99"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  disabled={query.trim().length > 0 || category.trim().length > 0}
                />
              </div>
            </div>
            <div className="col-md-1 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => { setQuery(''); setCategory(''); setMinPrice(''); setMaxPrice(''); }}
                disabled={loading}
                title="Clear all filters"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="alert alert-info mb-0" role="alert">
          Loading products...
        </div>
      )}

      {!loading && errorMsg && (
        <div className="alert alert-danger" role="alert">
          {errorMsg}
        </div>
      )}

      {!loading && !errorMsg && (
        <>
          {products.length === 0 ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <div className="mb-3">📦</div>
                <h5 className="text-muted">No products found</h5>
                <p className="text-muted mb-0">
                  {query || category || minPrice || maxPrice 
                    ? 'Try adjusting your search criteria' 
                    : 'Start by adding your first product'
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm d-none d-lg-block">
              <div className="card-body p-0">
            <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col" className="px-4 py-3 border-0">ID</th>
                        <th scope="col" className="px-4 py-3 border-0">Product Name</th>
                        <th scope="col" className="px-4 py-3 border-0">Category</th>
                        <th scope="col" className="px-4 py-3 border-0">Description</th>
                        <th scope="col" className="px-4 py-3 border-0 text-end">Price</th>
                        <th scope="col" className="px-4 py-3 border-0 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                      {products.map((p, index) => (
                        <tr key={p.id} className={index % 2 === 0 ? 'bg-white' : 'bg-light'}>
                          <td className="px-4 py-3">
                            <span className="badge bg-secondary">{p.id}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="fw-semibold">{p.name}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="badge bg-info text-dark">{p.category}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-muted small">{p.description}</div>
                          </td>
                          <td className="px-4 py-3 text-end">
                            <span className="fw-bold text-success">
                              ${typeof p.price === 'number' ? p.price.toFixed(2) : p.price}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button 
                              className="btn btn-sm btn-danger" 
                              onClick={() => handleDelete(p.id)}
                              title="Delete product"
                            >
                              🗑️ Delete
                            </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                </div>
              </div>
            </div>
          )}

          {/* Mobile/Tablet: Card Grid */}
          {products.length > 0 && (
            <div className="d-block d-lg-none">
              <div className="row g-3">
                {products.map((p) => (
                  <div key={p.id} className="col-12 col-sm-6">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProductsPage;


