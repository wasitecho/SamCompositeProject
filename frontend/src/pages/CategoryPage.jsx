import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function CategoryPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        // Try nested load via /categories first to get the name
        const categoryRes = await api.get(`/categories/${id}`);
        setCategoryName(categoryRes.data?.name || 'Category');
      } catch (e) {
        setCategoryName('Category');
      }
      try {
        const res = await api.get(`/categories/${id}/subcategories`);
        setSubcategories(res.data || []);
      } catch (e) {
        setError('Failed to load subcategories');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  return (
    <div className="container">
      <h2 className="mb-3">{categoryName}</h2>
      <p className="text-muted">Subcategories</p>
      {loading && <div>Loading...</div>}
      {error && <div className="text-danger small mb-2">{error}</div>}
      <div className="list-group">
        {(subcategories || []).map(sc => (
          <button
            key={sc.id}
            type="button"
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            onClick={() => navigate(`/subcategories/${sc.id}`)}
          >
            <span>{sc.name}</span>
            <span className="badge bg-light text-secondary">View</span>
          </button>
        ))}
        {(!subcategories || subcategories.length === 0) && !loading && (
          <div className="text-muted small">No subcategories</div>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;


