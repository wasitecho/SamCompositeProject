import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

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

  // Color schemes for different grades
  const getGradeColors = (index) => {
    const colorSchemes = [
      { bg: 'from-blue-50 to-indigo-100', hover: 'from-blue-500 to-indigo-600', accent: 'blue' },
      { bg: 'from-green-50 to-emerald-100', hover: 'from-green-500 to-emerald-600', accent: 'green' },
      { bg: 'from-purple-50 to-violet-100', hover: 'from-purple-500 to-violet-600', accent: 'purple' },
      { bg: 'from-orange-50 to-red-100', hover: 'from-orange-500 to-red-600', accent: 'orange' },
      { bg: 'from-pink-50 to-rose-100', hover: 'from-pink-500 to-rose-600', accent: 'pink' },
      { bg: 'from-cyan-50 to-teal-100', hover: 'from-cyan-500 to-teal-600', accent: 'cyan' },
      { bg: 'from-yellow-50 to-amber-100', hover: 'from-yellow-500 to-amber-600', accent: 'yellow' },
      { bg: 'from-indigo-50 to-blue-100', hover: 'from-indigo-500 to-blue-600', accent: 'indigo' }
    ];
    return colorSchemes[index % colorSchemes.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {categoryName ? `${categoryName} - Grades` : 'Grades'}
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Select a grade to view detailed specifications and pricing
          </motion.p>
          {categoryId && (
            <motion.div 
              className="text-sm text-gray-500 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
             
            </motion.div>
          )}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div 
            className="flex justify-center items-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Loading grades...</span>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        {/* Grades Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {grades.map((grade, index) => {
              const colors = getGradeColors(index);
              return (
                <motion.div
                  key={grade.id}
                  className="group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div 
                    className={`h-full rounded-2xl border-2 border-transparent bg-gradient-to-br ${colors.bg} shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-center relative overflow-hidden cursor-pointer`}
                    onClick={() => navigate(`/product/${grade.id}?gradeName=${encodeURIComponent(grade.typeCode)}`)}
                    whileHover={{ 
                      background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                      borderColor: `var(--${colors.accent}-500)`
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Background overlay */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${colors.hover} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon */}
                      <motion.div 
                        className="flex items-center justify-center w-16 h-16 rounded-full bg-white/80 shadow-md mb-4 mx-auto"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-2xl">🏷️</span>
                      </motion.div>

                      {/* Type Code */}
                      <motion.h3 
                        className="text-xl font-bold text-center mb-3 text-gray-800"
                        whileHover={{ scale: 1.05 }}
                      >
                        {grade.typeCode}
                      </motion.h3>

                      {/* Description */}
                      <motion.p 
                        className="text-gray-600 text-sm text-center mb-6"
                        whileHover={{ scale: 1.02 }}
                      >
                        Click to view specifications and pricing
                      </motion.p>

                      {/* View Details Button */}
                      <motion.button
                        className={`w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r ${colors.hover} shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span>View Details</span>
                        <motion.span
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.2 }}
                        >
                          →
                        </motion.span>
                      </motion.button>
                    </div>

                    {/* Bottom accent line */}
                    <motion.div 
                      className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.hover} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && grades.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              📋
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Grades Available</h3>
            <p className="text-gray-500">No grades have been added for this category yet.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default GradesPage;


