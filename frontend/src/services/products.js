import api from './api';

export const fetchProducts = async () => {
  const { data } = await api.get('/products');
  return data || [];
};

export const fetchProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const createProduct = async (product) => {
  const { data } = await api.post('/products', product);
  return data;
};

export const createProductsBulk = async (products) => {
  const { data } = await api.post('/products/bulk', products);
  return data || [];
};

export const updateProduct = async (id, product) => {
  const { data } = await api.put(`/products/${id}`, product);
  return data;
};

export const deleteProduct = async (id) => {
  await api.delete(`/products/${id}`);
};

export const searchProductsByName = async (name) => {
  const { data } = await api.get(`/products/search`, { params: { name } });
  return data || [];
};

export const fetchProductsByCategory = async (category) => {
  const { data } = await api.get(`/products/category/${encodeURIComponent(category)}`);
  return data || [];
};

export const fetchProductsByPriceRange = async (minPrice, maxPrice) => {
  const { data } = await api.get(`/products/price-range`, { params: { minPrice, maxPrice } });
  return data || [];
};



