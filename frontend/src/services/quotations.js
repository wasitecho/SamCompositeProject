import api from './api';

// Full Sheets Quotation API calls
export const createFullSheetsQuotation = async (quotationData) => {
  try {
    const response = await api.post('/quotations/full-sheets', quotationData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create full sheets quotation');
  }
};

export const getAllFullSheetsQuotations = async () => {
  try {
    const response = await api.get('/quotations/full-sheets');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch full sheets quotations');
  }
};

// Cut-to-Size Quotation API calls
export const createCutToSizeQuotation = async (quotationData) => {
  try {
    const response = await api.post('/quotations/cut-to-size', quotationData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create cut-to-size quotation');
  }
};

export const getAllCutToSizeQuotations = async () => {
  try {
    const response = await api.get('/quotations/cut-to-size');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch cut-to-size quotations');
  }
};

// Generic quotation API call
export const getQuotationById = async (id) => {
  try {
    const response = await api.get(`/quotations/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch quotation');
  }
};
