import api from './api';

export const gradesApi = {
  // Get all grades
  getAll: () => api.get('/grades'),
  
  // Get grade by ID
  getById: (id) => api.get(`/grades/${id}`),
  
  // Create new grade with category ID
  create: (categoryId, gradeData) => api.post(`/grades?categoryId=${categoryId}`, gradeData),
  
  // Update grade
  update: (id, gradeData) => api.put(`/grades/${id}`, gradeData),
  
  // Delete grade
  delete: (id) => api.delete(`/grades/${id}`),
  
  // Get grades by category ID
  getByCategory: (categoryId) => api.get(`/grades/by-category/${categoryId}`),
  
  // Get grades by type code
  getByTypeCode: (typeCode) => api.get(`/grades/by-type/${typeCode}`)
};
