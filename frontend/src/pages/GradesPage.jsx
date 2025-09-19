import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

function GradesPage() {
  const navigate = useNavigate();
  const { id: routeId } = useParams(); // optional in this flow
  const query = useQuery();
  const categoryId = routeId || query.get('categoryId');
  const categoryName = query.get('categoryName') || '';
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadGrades() {
      setLoading(true);
      setError('');
      try {
        console.log('Loading grades for categoryId:', categoryId);
        const res = await api.get(`/grades/by-category/${categoryId}`);
        console.log('Grades response:', res.data);
        setGrades(res.data || []);
      } catch (e) {
        console.error('Error loading grades:', e);
        setError('Failed to load grades');
      } finally {
        setLoading(false);
      }
    }
    if (categoryId) loadGrades();
  }, [categoryId]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">{categoryName ? `${categoryName} - Grades` : 'Grades'}</h2>
      <div className="text-sm text-gray-500 mb-4">Category ID: {categoryId || 'Not provided'}</div>
      {loading && <div className="text-gray-600">Loading...</div>}
      {error && <div className="rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-2">{error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {grades.map(g => (
                <tr key={g.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/product/${g.id}?gradeName=${encodeURIComponent(g.typeCode)}`)}>
                  <td className="px-4 py-3 text-gray-800">{g.typeCode}</td>
                </tr>
              ))}
              {grades.length === 0 && (
                <tr>
                  <td colSpan="2" className="px-4 py-6 text-gray-500">No grades found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default GradesPage;


