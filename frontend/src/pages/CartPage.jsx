import { useEffect, useState } from 'react';
import { getCartItems, updateCartItem, removeCartItem } from '../services/cart';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [removingItems, setRemovingItems] = useState(new Set());
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    loadCartItems();
  }, []);

  // Update cart total whenever cartItems changes
  useEffect(() => {
    const total = cartItems.reduce((total, item) => total + parseFloat(item.totalPrice), 0);
    setCartTotal(total);
    console.log('💰 Cart total updated:', { 
      cartItemsCount: cartItems.length, 
      newTotal: total,
      cartItems: cartItems.map(item => ({ id: item.id, totalPrice: item.totalPrice }))
    });
  }, [cartItems]);

  const loadCartItems = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getCartItems();
      if (result.success) {
        setCartItems(result.data);
        // Calculate initial total
        const total = result.data.reduce((total, item) => total + parseFloat(item.totalPrice), 0);
        setCartTotal(total);
        console.log('📦 Initial cart loaded:', { 
          itemsCount: result.data.length, 
          initialTotal: total 
        });
      } else {
        setError(result.message || 'Failed to load cart items');
      }
    } catch (e) {
      setError('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(cartId));
    setMessage('');
    
    // Optimistically update the UI immediately for smooth experience
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => 
        item.id === cartId 
          ? { 
              ...item, 
              quantity: newQuantity,
              totalPrice: (parseFloat(item.unitPrice) * newQuantity).toString()
            }
          : item
      );
      console.log('🔄 Cart items after quantity update:', { 
        cartId, 
        newQuantity,
        updatedItems: updatedItems.map(item => ({ id: item.id, quantity: item.quantity, totalPrice: item.totalPrice }))
      });
      return updatedItems;
    });
    
    try {
      const result = await updateCartItem(cartId, newQuantity);
      if (!result.success) {
        // If API call fails, revert the optimistic update
        await loadCartItems();
        setMessage(result.message || 'Failed to update cart item');
      }
    } catch (e) {
      // If API call fails, revert the optimistic update
      await loadCartItems();
      setMessage('Failed to update cart item');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (cartId) => {
    setRemovingItems(prev => new Set(prev).add(cartId));
    setMessage('');
    
    // Store the original item for potential rollback
    const originalItem = cartItems.find(item => item.id === cartId);
    console.log('🗑️ Removing item:', { cartId, originalItem });
    
    // Optimistically remove the item from UI immediately for smooth experience
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== cartId);
      console.log('🔄 Cart items after removal:', { 
        beforeCount: prevItems.length, 
        afterCount: newItems.length,
        removedItem: originalItem,
        newItems: newItems.map(item => ({ id: item.id, totalPrice: item.totalPrice }))
      });
      return newItems;
    });
    
    try {
      const result = await removeCartItem(cartId);
      if (!result.success) {
        // If API call fails, revert the optimistic update
        setCartItems(prevItems => [...prevItems, originalItem].sort((a, b) => a.id - b.id));
        setMessage(result.message || 'Failed to remove cart item');
      }
    } catch (e) {
      // If API call fails, revert the optimistic update
      setCartItems(prevItems => [...prevItems, originalItem].sort((a, b) => a.id - b.id));
      setMessage('Failed to remove cart item');
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartId);
        return newSet;
      });
    }
  };

  const calculateTotal = () => {
    console.log('🛒 Cart Total Calculation (using state):', {
      cartItemsCount: cartItems.length,
      cartTotal: cartTotal,
      cartItems: cartItems.map(item => ({ id: item.id, totalPrice: item.totalPrice }))
    });
    return cartTotal;
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading cart items...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error</h4>
              <p>{error}</p>
              <button className="btn btn-outline-danger" onClick={loadCartItems}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Shopping Cart</h2>
            <div className="text-end">
              <h4 className="text-primary mb-0">
                Total: ₹{calculateTotal().toFixed(2)}
              </h4>
              <small className="text-muted">{cartItems.length} item(s)</small>
            </div>
          </div>

          {message && (
            <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
              {message}
              <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
            </div>
          )}

          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-4">
                <i className="bi bi-cart-x" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
              </div>
              <h4 className="text-muted">Your cart is empty</h4>
              <p className="text-muted">Add some products to get started!</p>
              <a href="/products" className="btn btn-primary">
                Browse Products
              </a>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover" style={{ tableLayout: 'fixed' }}>
                <thead className="table-dark">
                  <tr>
                    <th>Product Details</th>
                    <th>Unit Price</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} style={{ transition: 'all 0.2s ease' }}>
                      <td>
                        <div>
                          <strong>{item.series}</strong>
                          <br />
                          <small className="text-muted">
                            Grade: {item.gradeName}
                            <br />
                            Thickness: {item.thicknessName}
                            <br />
                            Size: {item.length}x{item.breadth}
                            {item.discount && parseFloat(item.discount) > 0 && (
                              <>
                                <br />
                                Discount: {parseFloat(item.discount).toFixed(0)}%
                              </>
                            )}
                          </small>
                        </div>
                      </td>
                      <td>
                        <strong>₹{parseFloat(item.unitPrice).toFixed(2)}</strong>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="fw-bold" style={{ minWidth: '30px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        <strong className="text-success">
                          ₹{parseFloat(item.totalPrice).toFixed(2)}
                        </strong>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={removingItems.has(item.id)}
                          style={{ minWidth: '80px' }}
                        >
                          {removingItems.has(item.id) ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-1" role="status">
                                <span className="visually-hidden">Removing...</span>
                              </span>
                              Removing...
                            </>
                          ) : (
                            'Remove'
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="row mt-4">
              <div className="col-md-8">
                <div className="alert alert-info">
                  <h5 className="alert-heading">Next Steps</h5>
                  <p className="mb-0">
                    Your cart items are saved. You can continue shopping or proceed with your quotation request.
                    The cart functionality works independently from the quotation system.
                  </p>
                </div>
              </div>
              <div className="col-md-4 text-end">
                <div className="card bg-light">
                  <div className="card-body">
                    <h5 className="card-title">Cart Summary</h5>
                    <div className="d-flex justify-content-between">
                      <span>Items:</span>
                      <span>{cartItems.length}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Subtotal:</span>
                      <span>₹{calculateTotal().toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <strong>Total:</strong>
                      <strong className="text-primary">₹{calculateTotal().toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartPage;
