import api from './api';

export const categoriesApi = {
  // Get all categories
  getAll: () => api.get('/categories'),
  
  // Get category by ID
  getById: (id) => api.get(`/categories/${id}`),
  
  // Create new category
  create: (categoryData) => api.post('/categories', categoryData),
  
  // Update category
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  
  // Delete category
  delete: (id) => api.delete(`/categories/${id}`),
  
  // Get grades for a specific category
  getGrades: (categoryId) => api.get(`/categories/${categoryId}/grades`)
};
