import api from './api';

export const addToCart = async (productPriceId, quantity, discount = 0) => {
  try {
    const response = await api.post('/cart', {
      productPriceId,
      quantity,
      discount
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error adding to cart:', error);
    console.error('Error response:', error.response);
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    
    let errorMessage = 'Failed to add item to cart';
    
    if (error.response?.data) {
      errorMessage = typeof error.response.data === 'string' 
        ? error.response.data 
        : error.response.data.message || JSON.stringify(error.response.data);
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { 
      success: false, 
      message: errorMessage 
    };
  }
};

export const getCartItems = async () => {
  try {
    const response = await api.get('/cart');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return { 
      success: false, 
      message: error.response?.data || 'Failed to fetch cart items' 
    };
  }
};

export const updateCartItem = async (cartId, quantity) => {
  try {
    const response = await api.put(`/cart/${cartId}`, {
      quantity
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error updating cart item:', error);
    return { 
      success: false, 
      message: error.response?.data || 'Failed to update cart item' 
    };
  }
};

export const removeCartItem = async (cartId) => {
  try {
    const response = await api.delete(`/cart/${cartId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error removing cart item:', error);
    return { 
      success: false, 
      message: error.response?.data || 'Failed to remove cart item' 
    };
  }
};
