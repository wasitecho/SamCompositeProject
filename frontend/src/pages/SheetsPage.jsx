import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function SheetsPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/categories');
        setCategories(res.data || []);
      } catch (e) {
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="container">
      <h2 className="mb-3">Sheets</h2>
      <p className="text-muted">Browse categories</p>
      {loading && <div>Loading...</div>}
      {error && <div className="text-danger small mb-2">{error}</div>}
      <div className="list-group">
        {(categories || []).map(cat => (
          <button
            key={cat.id}
            type="button"
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            onClick={() => navigate(`/categories/${cat.id}`)}
          >
            <span>{cat.name}</span>
            <span className="badge bg-light text-secondary">View</span>
          </button>
        ))}
        {(!categories || categories.length === 0) && !loading && (
          <div className="text-muted small">No categories</div>
        )}
      </div>
    </div>
  );
}

export default SheetsPage;


