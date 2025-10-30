import api from './api';

// Full Sheets Quotation API calls
export const createFullSheetsQuotation = async (quotationData) => {
  try {
    const response = await api.post('/quotations/full-sheets', quotationData);
    console.log('Full sheets quotation response:', response);
    console.log('Response data:', response.data);
    console.log('Response status:', response.status);
    return response.data;
  } catch (error) {
    console.error('Full sheets quotation error:', error);
    console.error('Error response:', error.response);
    console.error('Error data:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    // If it's a successful response but caught as error, return the data
    if (error.response?.status === 201 || error.response?.status === 200) {
      console.log('Response was successful but caught as error, returning data:', error.response.data);
      return error.response.data;
    }
    
    throw new Error(error.response?.data?.message || error.response?.data || 'Failed to create full sheets quotation');
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
    console.log('Cut-to-size quotation response:', response);
    console.log('Response data:', response.data);
    console.log('Response status:', response.status);
    return response.data;
  } catch (error) {
    console.error('Cut-to-size quotation error:', error);
    console.error('Error response:', error.response);
    console.error('Error data:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    // If it's a successful response but caught as error, return the data
    if (error.response?.status === 201 || error.response?.status === 200) {
      console.log('Response was successful but caught as error, returning data:', error.response.data);
      return error.response.data;
    }
    
    throw new Error(error.response?.data?.message || error.response?.data || 'Failed to create cut-to-size quotation');
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
