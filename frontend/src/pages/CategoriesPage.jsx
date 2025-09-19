import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

function CategoriesPage() {
  const navigate = useNavigate();
  const query = useQuery();
  const type = query.get('type') || 'sheet';
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/categories`, { params: { type } });
        setCategories(res.data || []);
      } catch (e) {
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [type]);

  return (
    <div className="container">
      <h2 className="mb-3 text-capitalize">{type}s</h2>
      <p className="text-muted">Browse categories</p>
      {loading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>}
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <div className="list-group">
        {(categories || []).map(cat => (
          <button
            key={cat.id}
            type="button"
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            onClick={() => navigate(`/grades?categoryId=${cat.id}&categoryName=${encodeURIComponent(cat.name || '')}`)}
          >
            <span>{cat.name}</span>
            <span className="badge bg-light text-secondary">View grades</span>
          </button>
        ))}
        {(!categories || categories.length === 0) && !loading && (
          <div className="text-muted small">No categories</div>
        )}
      </div>
    </div>
  );
}

export default CategoriesPage;


