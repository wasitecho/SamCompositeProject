import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { categoriesApi } from '../services/categories';
import { gradesApi } from '../services/grades';
import { useAuth } from '../contexts/AuthContext';

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

function CategoriesPage() {
  const navigate = useNavigate();
  const query = useQuery();
  const type = query.get('type') || 'sheet';
  const { isAdmin } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  // Load categories function
  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await api.get(`/categories`, { params: { type } });
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
      await api.post('/categories', { name: newCategoryName.trim(), type: type });
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

  // Color schemes for different categories
  const getCategoryColors = (index) => {
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
          <div className="flex justify-between items-center mb-8">
            <div className="flex-1"></div>
            <div className="flex-1 text-center">
              <motion.h2 
                className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}s
              </motion.h2>
              <motion.p 
                className="text-gray-600 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Browse our comprehensive range of {type} categories
              </motion.p>
            </div>
            <div className="flex-1 flex justify-end">
              {isAdmin() && (
                <motion.button
                  onClick={() => setShowCategoryModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>📁</span>
                  <span>Add Category</span>
                </motion.button>
              )}
            </div>
          </div>
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
              <span className="text-gray-600">Loading categories...</span>
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

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(categories || []).map((cat, index) => {
            const colors = getCategoryColors(index);
            return (
              <motion.div
                key={cat.id}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div 
                  className={`h-full rounded-2xl border-2 border-transparent bg-gradient-to-br ${colors.bg} shadow-lg hover:shadow-2xl transition-all duration-300 p-6 relative overflow-hidden`}
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
                      <span className="text-2xl">📋</span>
                    </motion.div>

                    {/* Title */}
                    <motion.h3 
                      className="text-xl font-bold text-center mb-3 text-gray-800"
                      whileHover={{ scale: 1.05 }}
                    >
                      {cat.name}
                    </motion.h3>

                    {/* Description */}
                    <motion.p 
                      className="text-gray-600 text-sm text-center mb-6"
                      whileHover={{ scale: 1.02 }}
                    >
                      Explore {cat.name.toLowerCase()} grades and specifications
                    </motion.p>

                    {/* Buttons */}
                    <div className="space-y-2">
                      <motion.button
                        onClick={() => navigate(`/grades?categoryId=${cat.id}&categoryName=${encodeURIComponent(cat.name || '')}`)}
                        className={`w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r ${colors.hover} shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span>View Grades</span>
                        <motion.span
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.2 }}
                        >
                          →
                        </motion.span>
                      </motion.button>
                      
                      {isAdmin() && (
                        <motion.button
                          onClick={() => handleOpenGradeModal(cat)}
                          className="w-full py-2 px-4 rounded-xl font-semibold text-gray-700 bg-white/80 hover:bg-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span>📋</span>
                          <span>Manage Grades</span>
                        </motion.button>
                      )}
                    </div>
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

        {/* Empty State */}
        {(!categories || categories.length === 0) && !loading && !error && (
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
              📂
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Categories Available</h3>
            <p className="text-gray-500">No {type} categories have been added yet.</p>
          </motion.div>
        )}

        {/* Categories Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">📁 Manage Categories</h3>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              {/* Add New Category */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">Add New Category</h4>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                  <button
                    onClick={handleAddCategory}
                    disabled={!newCategoryName.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Category
                  </button>
                </div>
              </div>

              {/* Categories List */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Existing Categories</h4>
                {loadingCategories ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {categories.map((category) => (
                      <div key={category.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-semibold">{category.name}</span>
                        {isAdmin() && (
                          <button
                            onClick={() => handleOpenGradeModal(category)}
                            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                          >
                            📋 Manage Grades
                          </button>
                        )}
                      </div>
                    ))}
                    {categories.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        No categories found. Add one above.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Grades Modal */}
        {showGradeModal && selectedCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">📋 Manage Grades - {selectedCategory.name}</h3>
                <button
                  onClick={() => {
                    setShowGradeModal(false);
                    setSelectedCategory(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              {/* Add New Grade */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">Add New Grade</h4>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter grade name"
                    value={newGradeName}
                    onChange={(e) => setNewGradeName(e.target.value)}
                  />
                  <button
                    onClick={handleAddGrade}
                    disabled={!newGradeName.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Grade
                  </button>
                </div>
              </div>

              {/* Grades List */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Existing Grades</h4>
                {loadingGrades ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {grades.map((grade) => (
                      <div key={grade.id} className="p-3 bg-gray-50 rounded-lg">
                        <span className="font-semibold">{grade.typeCode}</span>
                      </div>
                    ))}
                    {grades.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        No grades found. Add one above.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoriesPage;


