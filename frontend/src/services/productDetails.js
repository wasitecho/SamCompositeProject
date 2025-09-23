import api from './api';

// Product Details (Series)
export const fetchProductDetailsByGrade = async (gradeId) => {
  const { data } = await api.get(`/product-details/${gradeId}`);
  return data;
};

export const createProductDetails = async (productDetails) => {
  const { data } = await api.post('/product-details', productDetails);
  return data;
};

// Product Thickness
export const fetchThicknesses = async () => {
  const { data } = await api.get('/product-thickness');
  return data || [];
};

export const createThickness = async (thickness) => {
  const { data } = await api.post('/product-thickness', thickness);
  return data;
};

// Product Size
export const fetchSizes = async () => {
  const { data } = await api.get('/product-size');
  return data || [];
};

export const createSize = async (size) => {
  const { data } = await api.post('/product-size', size);
  return data;
};

// Product Price
export const fetchPricesByGrade = async (gradeId) => {
  const { data } = await api.get(`/product-price/grade/${gradeId}`);
  return data || [];
};

export const createPrice = async (price) => {
  const { data } = await api.post('/product-price', price);
  return data;
};

