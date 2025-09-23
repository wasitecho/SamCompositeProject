import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../services/api';
import { 
  fetchProductDetailsByGrade, 
  createProductDetails,
  fetchThicknesses,
  createThickness,
  fetchSizes,
  createSize,
  fetchPricesByGrade,
  createPrice
} from '../services/productDetails';
import { addToCart } from '../services/cart';
import { createFullSheetsQuotation, createCutToSizeQuotation } from '../services/quotations';

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

function ProductDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // gradeId
  const query = useQuery();
  const gradeName = query.get('gradeName') || '';
  const [productDetails, setProductDetails] = useState([]);
  const [thicknesses, setThicknesses] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Tab state
  const [activeTab, setActiveTab] = useState('full-sheets');

  // Dropdown selections for Full Sheets
  const [quantity, setQuantity] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('');
  const [selectedThickness, setSelectedThickness] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [quoteMsg, setQuoteMsg] = useState('');

  // Cut To Size specific state
  const [cutLength, setCutLength] = useState('');
  const [cutWidth, setCutWidth] = useState('');
  const [cutSizeArea, setCutSizeArea] = useState('');
  const [fullSheetPrice, setFullSheetPrice] = useState('');
  const [fullSheetSize, setFullSheetSize] = useState('');
  const [calculatedPrice, setCalculatedPrice] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [machiningCost, setMachiningCost] = useState('');
  const [quantityPerSheet, setQuantityPerSheet] = useState('');
  const [numberOfFullSheetsRequired, setNumberOfFullSheetsRequired] = useState('');
  const [showCutSizeModal, setShowCutSizeModal] = useState(false);
  const [showFullSheetModal, setShowFullSheetModal] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  
  // Quotation saving states
  const [savingQuotation, setSavingQuotation] = useState(false);
  const [quotationMessage, setQuotationMessage] = useState('');

  // Individual modal states for each field
  const [showSeriesModal, setShowSeriesModal] = useState(false);
  const [showThicknessModal, setShowThicknessModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  
  // Loading states for each modal
  const [seriesLoading, setSeriesLoading] = useState(false);
  const [thicknessLoading, setThicknessLoading] = useState(false);
  const [sizeLoading, setSizeLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);
  
  // Error and success states for each modal
  const [seriesError, setSeriesError] = useState('');
  const [thicknessError, setThicknessError] = useState('');
  const [sizeError, setSizeError] = useState('');
  const [priceError, setPriceError] = useState('');
  
  const [seriesSuccess, setSeriesSuccess] = useState('');
  const [thicknessSuccess, setThicknessSuccess] = useState('');
  const [sizeSuccess, setSizeSuccess] = useState('');
  const [priceSuccess, setPriceSuccess] = useState('');

  // Form data for individual fields
  const [seriesFormData, setSeriesFormData] = useState({ series: '' });
  const [thicknessFormData, setThicknessFormData] = useState({ thickness: '' });
  const [sizeFormData, setSizeFormData] = useState({ length: '', breadth: '' });
  const [priceFormData, setPriceFormData] = useState({
    productDetailId: '',
    thicknessId: '',
    sizeId: '',
    price: ''
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch all required data
        const [detailsResponse, thicknessesData, sizesData, pricesData] = await Promise.all([
          fetchProductDetailsByGrade(id),
          fetchThicknesses(),
          fetchSizes(),
          fetchPricesByGrade(id)
        ]);
        
        console.log('📦 Loaded product details:', detailsResponse);
        console.log('📊 Thicknesses:', thicknessesData);
        console.log('📊 Sizes:', sizesData);
        console.log('📊 Prices:', pricesData);
        
        setProductDetails(detailsResponse.productDetails || []);
        setThicknesses(thicknessesData);
        setSizes(sizesData);
        setPrices(pricesData);
      } catch (e) {
        console.error('🚨 Error loading data:', e);
        console.error('🚨 Error details:', {
          message: e.message,
          response: e.response?.data,
          status: e.response?.status,
          statusText: e.response?.statusText,
          url: e.config?.url
        });
        
        let errorMessage = 'Failed to load product data';
        if (e.response?.data?.message) {
          errorMessage = e.response.data.message;
        } else if (e.response?.status === 500) {
          errorMessage = 'Server error occurred. Please check if the database is running and try again.';
        } else if (e.response?.status === 404) {
          errorMessage = 'Grade not found. Please check if the grade ID is correct.';
        } else if (e.response?.status === 400) {
          errorMessage = 'Invalid request. Please check the grade ID.';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  // Auto-populate base price when all fields are selected AND quantity is entered
  useEffect(() => {
    const findPrice = () => {
      if (selectedSeries && selectedThickness && selectedSize && quantity && parseInt(quantity) >= 1) {
        try {
          console.log('🔍 Finding price for:', { 
            gradeId: id, 
            series: selectedSeries,
            thickness: selectedThickness, 
            size: selectedSize
          });
          
          // Find matching price in loaded data
          const matchingPrice = prices.find(price => 
            price.thicknessName === selectedThickness && 
            `${price.length}x${price.breadth}` === selectedSize &&
            price.productDetailId && productDetails.find(pd => pd.id === price.productDetailId && pd.series === selectedSeries)
          );
          
          console.log('🔍 Matching price in loaded data:', matchingPrice);
          
          if (matchingPrice && matchingPrice.price) {
            setBasePrice(matchingPrice.price.toString());
            console.log('✅ Base price set to:', matchingPrice.price);
          } else {
            console.log('❌ No price found for this combination');
            setBasePrice('');
          }
        } catch (e) {
          console.error('🚨 Error finding price:', e);
          setBasePrice('');
        }
      } else {
        setBasePrice('');
      }
    };
    findPrice();
  }, [id, selectedSeries, selectedThickness, selectedSize, quantity, prices, productDetails]);

  // Calculate total price when quantity, base price, or discount changes
  useEffect(() => {
    if (basePrice && quantity) {
      const basePriceNum = parseFloat(basePrice);
      const quantityNum = parseInt(quantity);
      if (!isNaN(basePriceNum) && !isNaN(quantityNum) && quantityNum > 0) {
        let calculatedTotal = basePriceNum * quantityNum;
        
        // Apply discount if selected
        if (discount) {
          const discountNum = parseFloat(discount);
          if (!isNaN(discountNum) && discountNum > 0) {
            const discountAmount = calculatedTotal * (discountNum / 100);
            calculatedTotal = calculatedTotal - discountAmount;
          }
        }
        
        setTotalPrice(calculatedTotal.toString());
      } else {
        setTotalPrice('');
      }
    } else {
      setTotalPrice('');
    }
  }, [basePrice, quantity, discount]);

  // Fetch full sheet price and size for Cut To Size calculation
  useEffect(() => {
    const findFullSheetData = () => {
      if (activeTab === 'cut-to-size' && selectedSeries && selectedThickness && selectedSize) {
        try {
          console.log('🔍 Finding full sheet data for Cut To Size:', { 
            gradeId: id, 
            series: selectedSeries,
            thickness: selectedThickness, 
            size: selectedSize
          });
          
          // Find matching price in loaded data
          const matchingPrice = prices.find(price => 
            price.thicknessName === selectedThickness && 
            `${price.length}x${price.breadth}` === selectedSize &&
            price.productDetailId && productDetails.find(pd => pd.id === price.productDetailId && pd.series === selectedSeries)
          );
          
          console.log('🔍 Matching price for Cut To Size:', matchingPrice);
          
          if (matchingPrice && matchingPrice.price) {
            // Display the base price per unit immediately (no quantity required for this)
            setFullSheetPrice(matchingPrice.price.toString());
            setFullSheetSize(selectedSize); // Using the size field as full sheet size
            console.log('✅ Full sheet base price set for Cut To Size:', { fullSheetPrice: matchingPrice.price, fullSheetSize: selectedSize });
          } else {
            console.log('❌ No matching price found for Cut To Size');
            setFullSheetPrice('');
            setFullSheetSize('');
          }
        } catch (e) {
          console.error('🚨 Error finding full sheet data for Cut To Size:', e);
          setFullSheetPrice('');
          setFullSheetSize('');
        }
      } else {
        setFullSheetPrice('');
        setFullSheetSize('');
      }
    };
    findFullSheetData();
  }, [activeTab, id, selectedSeries, selectedThickness, selectedSize, prices, productDetails]);

  // Calculate cut size area when length and width are entered
  useEffect(() => {
    if (activeTab === 'cut-to-size' && cutLength && cutWidth) {
      const lengthNum = parseFloat(cutLength);
      const widthNum = parseFloat(cutWidth);
      
      if (!isNaN(lengthNum) && !isNaN(widthNum) && lengthNum > 0 && widthNum > 0) {
        const area = lengthNum * widthNum;
        setCutSizeArea(area.toString());
      } else {
        setCutSizeArea('');
      }
    } else {
      setCutSizeArea('');
    }
  }, [activeTab, cutLength, cutWidth]);

  // Calculate quantity per sheet when cut dimensions and full sheet size are available
  useEffect(() => {
    if (activeTab === 'cut-to-size' && cutLength && cutWidth && selectedSize) {
      const cutLengthNum = parseFloat(cutLength);
      const cutWidthNum = parseFloat(cutWidth);
      
      if (!isNaN(cutLengthNum) && !isNaN(cutWidthNum) && cutLengthNum > 0 && cutWidthNum > 0) {
        // Parse full sheet size (format: "1220x2420")
        const fullSheetDimensions = selectedSize.split('x');
        if (fullSheetDimensions.length === 2) {
          const fullSheetLength = parseFloat(fullSheetDimensions[0]);
          const fullSheetWidth = parseFloat(fullSheetDimensions[1]);
          
          if (!isNaN(fullSheetLength) && !isNaN(fullSheetWidth) && fullSheetLength > 0 && fullSheetWidth > 0) {
            // Calculate how many pieces can fit horizontally and vertically
            const piecesHorizontally = Math.floor(fullSheetLength / cutLengthNum);
            const piecesVertically = Math.floor(fullSheetWidth / cutWidthNum);
            
            // Total quantity per sheet (whole number only)
            const totalPiecesPerSheet = piecesHorizontally * piecesVertically;
            
            setQuantityPerSheet(totalPiecesPerSheet.toString());
            console.log('✅ Quantity per sheet calculated:', {
              fullSheetSize: selectedSize,
              cutSize: `${cutLengthNum}x${cutWidthNum}`,
              piecesHorizontally,
              piecesVertically,
              totalPiecesPerSheet
            });
          } else {
            setQuantityPerSheet('');
          }
        } else {
          setQuantityPerSheet('');
        }
      } else {
        setQuantityPerSheet('');
      }
    } else {
      setQuantityPerSheet('');
    }
  }, [activeTab, cutLength, cutWidth, selectedSize]);

  // Calculate number of full sheets required when quantity and quantity per sheet are available
  useEffect(() => {
    if (activeTab === 'cut-to-size' && quantity && quantityPerSheet) {
      const quantityNum = parseInt(quantity);
      const quantityPerSheetNum = parseInt(quantityPerSheet);
      
      if (!isNaN(quantityNum) && !isNaN(quantityPerSheetNum) && quantityNum > 0 && quantityPerSheetNum > 0) {
        // Calculate number of full sheets needed (round up to whole number)
        const sheetsRequired = Math.ceil(quantityNum / quantityPerSheetNum);
        
        setNumberOfFullSheetsRequired(sheetsRequired.toString());
        console.log('✅ Number of full sheets required calculated:', {
          requiredQuantity: quantityNum,
          quantityPerSheet: quantityPerSheetNum,
          sheetsRequired
        });
      } else {
        setNumberOfFullSheetsRequired('');
      }
    } else {
      setNumberOfFullSheetsRequired('');
    }
  }, [activeTab, quantity, quantityPerSheet]);

  // Calculate Cut To Size price per unit: Base Price × Number of Sheets ÷ Quantity
  useEffect(() => {
    if (activeTab === 'cut-to-size' && fullSheetPrice && numberOfFullSheetsRequired && quantity && parseInt(quantity) >= 1) {
      const basePriceNum = parseFloat(fullSheetPrice);
      const numberOfSheetsNum = parseInt(numberOfFullSheetsRequired);
      const quantityNum = parseInt(quantity);
      
      if (!isNaN(basePriceNum) && !isNaN(numberOfSheetsNum) && !isNaN(quantityNum) && quantityNum > 0) {
        // NEW CALCULATION: Base Price × Number of Sheets ÷ Quantity
        const pricePerUnit = (basePriceNum * numberOfSheetsNum) / quantityNum;
        setPricePerUnit(pricePerUnit.toString());
        console.log('✅ Cut-to-Size price per unit calculated:', {
          basePrice: basePriceNum,
          numberOfSheets: numberOfSheetsNum,
          quantity: quantityNum,
          pricePerUnit: pricePerUnit,
          calculation: `(${basePriceNum} × ${numberOfSheetsNum}) ÷ ${quantityNum} = ${pricePerUnit}`
        });
      } else {
        setPricePerUnit('');
      }
    } else {
      setPricePerUnit('');
    }
  }, [activeTab, fullSheetPrice, numberOfFullSheetsRequired, quantity]);

  // Calculate total price: Base Price × Number of Sheets × Quantity
  useEffect(() => {
    if (activeTab === 'cut-to-size') {
      if (fullSheetPrice && numberOfFullSheetsRequired && quantity) {
        const basePriceNum = parseFloat(fullSheetPrice);
        const numberOfSheetsNum = parseInt(numberOfFullSheetsRequired);
        const quantityNum = parseInt(quantity);
        
        if (!isNaN(basePriceNum) && !isNaN(numberOfSheetsNum) && !isNaN(quantityNum) && quantityNum > 0) {
          // NEW CALCULATION: Base Price × Number of Sheets × Quantity
          const totalCalculatedPrice = basePriceNum * numberOfSheetsNum * quantityNum;
          setCalculatedPrice(totalCalculatedPrice.toString());
          
          console.log('✅ Total Calculated Price:', {
            basePrice: basePriceNum,
            numberOfSheets: numberOfSheetsNum,
            quantity: quantityNum,
            calculation: `${basePriceNum} × ${numberOfSheetsNum} × ${quantityNum} = ${totalCalculatedPrice}`
          });
        } else {
          setCalculatedPrice('');
        }
      } else {
        setCalculatedPrice('');
      }
    }
  }, [activeTab, fullSheetPrice, numberOfFullSheetsRequired, quantity]);

  const showFullSheetQuotation = () => {
    if (totalPrice && quantity) {
      setQuoteMsg(`Quotation generated! Total Price: ₹${parseFloat(totalPrice).toFixed(2)} for ${quantity} units`);
      setShowFullSheetModal(true);
    }
  };

  const showCutSizeQuotation = () => {
    if (calculatedPrice && quantity) {
      // calculatedPrice is already the total price for all required full sheets + machining cost
      // No need to multiply by quantity again
      setShowCutSizeModal(true);
    }
  };

  const handleAddToCart = () => {
    if (hasProductDetails && selectedSeries && selectedThickness && selectedSize && basePrice && quantity && parseInt(quantity) >= 1) {
      setCartMessage('');
      setShowAddToCartModal(true);
    }
  };

  const submitAddToCart = async () => {
    setCartMessage('');
    try {
      console.log('Current selections:', {
        selectedSeries,
        selectedThickness,
        selectedSize,
        quantity
      });
      console.log('Available prices:', prices);
      console.log('Prices length:', prices.length);
      
      // Check if prices array is empty or invalid
      if (!prices || prices.length === 0) {
        setCartMessage('No prices available for this product. Please try again.');
        return;
      }
      
      // Find the product price ID based on current selections
      const selectedPrice = prices.find(price => {
        // Add null checks to prevent errors
        if (!price || !price.thicknessName || !price.length || !price.breadth || !price.productDetailId) {
          console.log('Price object missing required properties:', price);
          return false;
        }
        
        // Check if this price matches the selected series, thickness, and size
        const matchingProductDetail = productDetails.find(pd => 
          pd.id === price.productDetailId && pd.series === selectedSeries
        );
        
        return matchingProductDetail &&
               price.thicknessName === selectedThickness &&
               `${price.length}x${price.breadth}` === selectedSize;
      });

      console.log('Selected price:', selectedPrice);

      if (!selectedPrice) {
        setCartMessage('Product configuration not found. Please try again.');
        return;
      }

      console.log('Calling addToCart with:', {
        productPriceId: selectedPrice.id,
        quantity: parseInt(quantity),
        discount: discount || 0
      });

      const result = await addToCart(selectedPrice.id, parseInt(quantity), discount || 0);
      console.log('Add to cart result:', result);
      
      if (result.success) {
        setCartMessage('Item added to cart successfully!');
        setTimeout(() => {
          setShowAddToCartModal(false);
          setCartMessage('');
        }, 1500);
      } else {
        setCartMessage(result.message || 'Failed to add item to cart.');
      }
    } catch (e) {
      console.error('Exception in submitAddToCart:', e);
      setCartMessage('Failed to add item to cart.');
    }
  };

  // Save Full Sheets Quotation
  const saveFullSheetsQuotation = async () => {
    if (!hasProductDetails || !quantity || !selectedSeries || !selectedThickness || !selectedSize || !totalPrice) {
      setQuotationMessage('Please fill in all required fields before saving quotation.');
      return;
    }

    setSavingQuotation(true);
    setQuotationMessage('');

    try {
      // Find the selected price and related entities
      const selectedPrice = prices.find(price => {
        if (!price || !price.thicknessName || !price.length || !price.breadth || !price.productDetailId) {
          return false;
        }
        
        const matchingProductDetail = productDetails.find(pd => 
          pd.id === price.productDetailId && pd.series === selectedSeries
        );
        
        return matchingProductDetail &&
               price.thicknessName === selectedThickness &&
               `${price.length}x${price.breadth}` === selectedSize;
      });

      if (!selectedPrice) {
        setQuotationMessage('Product configuration not found. Please try again.');
        return;
      }

      const quotationData = {
        series: selectedSeries,
        thickness: parseFloat(selectedThickness.replace('mm', '')),
        size: selectedSize,
        quantity: parseInt(quantity),
        basePrice: parseFloat(basePrice),
        totalPrice: parseFloat(totalPrice),
        productDetailId: selectedPrice.productDetailId,
        thicknessId: selectedPrice.thicknessId,
        sizeId: selectedPrice.sizeId,
        productPriceId: selectedPrice.id
      };

      // Validate that all required fields are present and valid
      if (!quotationData.series || !quotationData.size || !quotationData.thickness || 
          !quotationData.quantity || !quotationData.basePrice || !quotationData.totalPrice ||
          !quotationData.productDetailId || !quotationData.thicknessId || 
          !quotationData.sizeId || !quotationData.productPriceId) {
        setQuotationMessage('Missing required data for quotation. Please try again.');
        return;
      }

      // Validate numeric values
      if (isNaN(quotationData.thickness) || isNaN(quotationData.basePrice) || 
          isNaN(quotationData.totalPrice) || isNaN(quotationData.quantity)) {
        setQuotationMessage('Invalid numeric values. Please check your inputs.');
        return;
      }

      console.log('Sending quotation data:', quotationData);
      console.log('Selected price object:', selectedPrice);
      console.log('ThicknessId:', selectedPrice.thicknessId);
      console.log('SizeId:', selectedPrice.sizeId);
      console.log('ProductDetailId:', selectedPrice.productDetailId);
      console.log('ProductPriceId:', selectedPrice.id);
      
      const result = await createFullSheetsQuotation(quotationData);
      console.log('Quotation creation result:', result);
      
      if (result && result.id) {
        setQuotationMessage(`Full sheets quotation saved successfully! Quotation ID: ${result.id}`);
        
        // Clear form after successful save
        setTimeout(() => {
          setQuotationMessage('');
          setQuantity('');
          setSelectedSeries('');
          setSelectedThickness('');
          setSelectedSize('');
          setBasePrice('');
          setTotalPrice('');
        }, 3000);
      } else {
        console.error('Unexpected response structure:', result);
        setQuotationMessage('Quotation saved but response format unexpected. Please check quotations history.');
      }

    } catch (error) {
      console.error('Error saving full sheets quotation:', error);
      setQuotationMessage('Failed to save quotation: ' + error.message);
    } finally {
      setSavingQuotation(false);
    }
  };

  // Save Cut-to-Size Quotation
  const saveCutToSizeQuotation = async () => {
    if (!hasProductDetails || !quantity || !selectedSeries || !selectedThickness || !selectedSize || 
        !cutLength || !cutWidth || !calculatedPrice) {
      setQuotationMessage('Please fill in all required fields before saving quotation.');
      return;
    }

    setSavingQuotation(true);
    setQuotationMessage('');

    try {
      // Find the selected price and related entities
      const selectedPrice = prices.find(price => {
        if (!price || !price.thicknessName || !price.length || !price.breadth || !price.productDetailId) {
          return false;
        }
        
        const matchingProductDetail = productDetails.find(pd => 
          pd.id === price.productDetailId && pd.series === selectedSeries
        );
        
        return matchingProductDetail &&
               price.thicknessName === selectedThickness &&
               `${price.length}x${price.breadth}` === selectedSize;
      });

      if (!selectedPrice) {
        setQuotationMessage('Product configuration not found. Please try again.');
        return;
      }

      const quotationData = {
        series: selectedSeries,
        thickness: parseFloat(selectedThickness.replace('mm', '')),
        sizeFullSheet: selectedSize,
        cutLength: parseFloat(cutLength),
        cutWidth: parseFloat(cutWidth),
        machiningCost: parseFloat(machiningCost || 0),
        cutSizeArea: parseFloat(cutSizeArea),
        quantityPerSheet: parseInt(quantityPerSheet),
        numFullSheetsRequired: parseInt(numberOfFullSheetsRequired),
        quantity: parseInt(quantity),
        basePriceFullSheet: parseFloat(fullSheetPrice),
        cutToSizePricePerUnit: parseFloat(pricePerUnit),
        totalCalculatedPrice: parseFloat(calculatedPrice),
        productDetailId: selectedPrice.productDetailId,
        productPriceId: selectedPrice.id
      };

      console.log('Sending cut-to-size quotation data:', quotationData);
      const result = await createCutToSizeQuotation(quotationData);
      console.log('Cut-to-size quotation creation result:', result);
      
      if (result && result.id) {
        setQuotationMessage(`Cut-to-size quotation saved successfully! Quotation ID: ${result.id}`);
        
        // Clear form after successful save
        setTimeout(() => {
          setQuotationMessage('');
          setQuantity('');
          setSelectedSeries('');
          setSelectedThickness('');
          setSelectedSize('');
          setCutLength('');
          setCutWidth('');
          setCalculatedPrice('');
        }, 3000);
      } else {
        console.error('Unexpected response structure:', result);
        setQuotationMessage('Quotation saved but response format unexpected. Please check quotations history.');
      }

    } catch (error) {
      console.error('Error saving cut-to-size quotation:', error);
      setQuotationMessage('Failed to save quotation: ' + error.message);
    } finally {
      setSavingQuotation(false);
    }
  };

  // Individual submit functions for each field
  const handleSeriesSubmit = async (e) => {
    e.preventDefault();
    setSeriesLoading(true);
    setSeriesError('');
    setSeriesSuccess('');

    try {
      if (!seriesFormData.series.trim()) {
        setSeriesError('Series name is required');
        setSeriesLoading(false);
        return;
      }

      const payload = {
        gradeId: parseInt(id),
        series: seriesFormData.series.trim()
      };

      const result = await createProductDetails(payload);
      
      if (result.success) {
        setSeriesSuccess('Series added successfully!');
        
        // Refresh product details
        const detailsResponse = await fetchProductDetailsByGrade(id);
        setProductDetails(detailsResponse.productDetails || []);
        
        // Reset form and close modal
        setSeriesFormData({ series: '' });
        setTimeout(() => {
          setShowSeriesModal(false);
          setSeriesSuccess('');
        }, 2000);
      } else {
        setSeriesError(result.message);
      }
    } catch (e) {
      console.error('Error adding series:', e);
      setSeriesError(e.response?.data?.message || 'Failed to add series');
    } finally {
      setSeriesLoading(false);
    }
  };

  const handleThicknessSubmit = async (e) => {
    e.preventDefault();
    setThicknessLoading(true);
    setThicknessError('');
    setThicknessSuccess('');

    try {
      if (!thicknessFormData.thickness || thicknessFormData.thickness <= 0) {
        setThicknessError('Valid thickness value is required');
        setThicknessLoading(false);
        return;
      }

      const thickness = parseFloat(thicknessFormData.thickness);
      if (isNaN(thickness) || thickness <= 0) {
        setThicknessError('Thickness must be a positive number');
        setThicknessLoading(false);
        return;
      }

      const result = await createThickness({ thickness });
      
      if (result.success) {
        setThicknessSuccess('Thickness added successfully!');
        
        // Refresh thicknesses
        const thicknessesData = await fetchThicknesses();
        setThicknesses(thicknessesData);
        
        // Reset form and close modal
        setThicknessFormData({ thickness: '' });
        setTimeout(() => {
          setShowThicknessModal(false);
          setThicknessSuccess('');
        }, 2000);
      } else {
        setThicknessError(result.message);
      }
    } catch (e) {
      console.error('Error adding thickness:', e);
      setThicknessError(e.response?.data?.message || 'Failed to add thickness');
    } finally {
      setThicknessLoading(false);
    }
  };

  const handleSizeSubmit = async (e) => {
    e.preventDefault();
    setSizeLoading(true);
    setSizeError('');
    setSizeSuccess('');

    try {
      if (!sizeFormData.length || !sizeFormData.breadth) {
        setSizeError('Length and breadth are required');
        setSizeLoading(false);
        return;
      }

      const length = parseInt(sizeFormData.length);
      const breadth = parseInt(sizeFormData.breadth);

      if (isNaN(length) || isNaN(breadth) || length <= 0 || breadth <= 0) {
        setSizeError('Length and breadth must be positive numbers');
        setSizeLoading(false);
        return;
      }

      const result = await createSize({ length, breadth });
      
      if (result.success) {
        setSizeSuccess('Size added successfully!');
        
        // Refresh sizes
        const sizesData = await fetchSizes();
        setSizes(sizesData);
        
        // Reset form and close modal
        setSizeFormData({ length: '', breadth: '' });
        setTimeout(() => {
          setShowSizeModal(false);
          setSizeSuccess('');
        }, 2000);
      } else {
        setSizeError(result.message);
      }
    } catch (e) {
      console.error('Error adding size:', e);
      setSizeError(e.response?.data?.message || 'Failed to add size');
    } finally {
      setSizeLoading(false);
    }
  };

  const handlePriceSubmit = async (e) => {
    e.preventDefault();
    setPriceLoading(true);
    setPriceError('');
    setPriceSuccess('');

    try {
      if (!priceFormData.productDetailId || !priceFormData.thicknessId || !priceFormData.sizeId || !priceFormData.price) {
        setPriceError('All fields are required');
        setPriceLoading(false);
        return;
      }

      const payload = {
        productDetailId: parseInt(priceFormData.productDetailId),
        thicknessId: parseInt(priceFormData.thicknessId),
        sizeId: parseInt(priceFormData.sizeId),
        price: parseFloat(priceFormData.price)
      };

      const result = await createPrice(payload);
      
      if (result.success) {
        setPriceSuccess('Price added successfully!');
        
        // Refresh prices
        const pricesData = await fetchPricesByGrade(id);
        setPrices(pricesData);
        
        // Reset form and close modal
        setPriceFormData({
          productDetailId: '',
          thicknessId: '',
          sizeId: '',
          price: ''
        });
        setTimeout(() => {
          setShowPriceModal(false);
          setPriceSuccess('');
        }, 2000);
      } else {
        setPriceError(result.message);
      }
    } catch (e) {
      console.error('Error adding price:', e);
      setPriceError(e.response?.data?.message || 'Failed to add price');
    } finally {
      setPriceLoading(false);
    }
  };

  // Modal close functions
  const handleSeriesModalClose = () => {
    setShowSeriesModal(false);
    setSeriesError('');
    setSeriesSuccess('');
    setSeriesFormData({ series: '' });
  };

  const handleThicknessModalClose = () => {
    setShowThicknessModal(false);
    setThicknessError('');
    setThicknessSuccess('');
    setThicknessFormData({ thickness: '' });
  };

  const handleSizeModalClose = () => {
    setShowSizeModal(false);
    setSizeError('');
    setSizeSuccess('');
    setSizeFormData({ length: '', breadth: '' });
  };

  const handlePriceModalClose = () => {
    setShowPriceModal(false);
    setPriceError('');
    setPriceSuccess('');
    setPriceFormData({
      productDetailId: '',
      thicknessId: '',
      sizeId: '',
      price: ''
    });
  };

  // Get unique values for dropdowns from product details
  const getUniqueSeries = () => {
    const values = productDetails.map(detail => detail.series).filter(Boolean);
    const uniqueValues = [...new Set(values)].sort();
    console.log('📋 Available series values:', uniqueValues);
    return uniqueValues;
  };

  // Check if a combination already exists
  const isCombinationExists = (series, thickness, size) => {
    if (!series || !thickness || !size) return false;
    
    return prices.some(price => 
      price.thicknessName === thickness && 
      `${price.length}x${price.breadth}` === size &&
      productDetails.some(pd => pd.id === price.productDetailId && pd.series === series)
    );
  };


  // Check if any product details exist
  const hasProductDetails = productDetails.length > 0;

  // Check if Full Sheet specifications are complete (for reference only)
  const isFullSheetComplete = () => {
    return quantity && selectedSeries && selectedThickness && selectedSize && basePrice && parseInt(quantity) >= 1;
  };

  // Function to reset form fields when switching tabs
  const resetFormFields = () => {
    setQuantity('');
    setSelectedSeries('');
    setSelectedThickness('');
    setSelectedSize('');
    setBasePrice('');
    setDiscount('');
    setTotalPrice('');
    setQuoteMsg('');
    setCutLength('');
    setCutWidth('');
    setCutSizeArea('');
    setFullSheetPrice('');
    setFullSheetSize('');
    setCalculatedPrice('');
    setPricePerUnit('');
    setMachiningCost('');
    setShowFullSheetModal(false);
    setShowCutSizeModal(false);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetFormFields();
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{gradeName || 'Product Details'}</h2>
      </div>
      
      {/* Tab Navigation */}
      <div className="mb-4">
        <div className="d-flex gap-2">
          <button 
            className={`btn ${activeTab === 'full-sheets' ? 'btn-warning' : 'btn-outline-secondary'}`}
            onClick={() => handleTabChange('full-sheets')}
            style={{
              borderRadius: '20px',
              padding: '8px 20px',
              fontWeight: '500'
            }}
          >
            FULL SHEETS
          </button>
          <button 
            className={`btn ${activeTab === 'cut-to-size' ? 'btn-warning' : 'btn-outline-secondary'}`}
            onClick={() => handleTabChange('cut-to-size')}
            style={{
              borderRadius: '20px',
              padding: '8px 20px',
              fontWeight: '500'
            }}
            title="Cut To Size Sheets - Click to calculate custom sizes"
          >
            CUT-TO-SIZE SHEETS
          </button>
        </div>
      </div>
      
      {/* Tab Content Header */}
      <div className="mb-3 p-3 bg-light rounded">
        <h5 className="mb-0">
          Calculate {activeTab === 'full-sheets' ? 'Full Sheets' : 'Cut-to-Size Sheets'} Cost for {gradeName || 'Product Details'}
        </h5>
      </div>
      
      {loading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>}
      {error && <div className="alert alert-danger py-2">{error}</div>}
      
      {/* Debug info - remove this later */}
      <div className="mb-2">
        <small className="text-muted">
          Debug: Grade ID: {id}, Product Details Count: {productDetails.length}, Loading: {loading.toString()}, Error: {error}
        </small>
      </div>

      {/* Show message when no product details exist */}
      {!loading && !error && productDetails.length === 0 && (
        <div className="alert alert-info">
          <h5>No Product Details Available</h5>
          <p>This grade doesn't have any product details yet. Use the + buttons next to each field to add series, thickness, size, and price data individually.</p>
        </div>
      )}

      {/* Tab Content */}
      {!loading && !error && activeTab === 'full-sheets' && (
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-10">
            <div className="row g-3">
              <div className="col-12 col-sm-6 col-lg-4">
                <label className="form-label">Series</label>
                <div className="input-group">
                  <select className="form-select" value={selectedSeries} onChange={(e) => setSelectedSeries(e.target.value)} disabled={!hasProductDetails}>
                    <option value="">{hasProductDetails ? 'Select Series' : 'No options available'}</option>
                    {getUniqueSeries().map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                  <button 
                    className="btn btn-outline-success" 
                    type="button"
                    onClick={() => setShowSeriesModal(true)}
                    disabled={loading}
                    title="Add new series"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <label className="form-label">Thickness</label>
                <div className="input-group">
                  <select className="form-select" value={selectedThickness} onChange={(e) => setSelectedThickness(e.target.value)} disabled={!hasProductDetails}>
                    <option value="">{hasProductDetails ? 'Select Thickness' : 'No options available'}</option>
                    {thicknesses.map(t => <option key={t.id} value={t.thicknessName}>{t.thicknessName}</option>)}
                  </select>
                  <button 
                    className="btn btn-outline-success" 
                    type="button"
                    onClick={() => setShowThicknessModal(true)}
                    disabled={loading}
                    title="Add new thickness"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <label className="form-label">Size</label>
                <div className="input-group">
                  <select className="form-select" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} disabled={!hasProductDetails}>
                    <option value="">{hasProductDetails ? 'Select Size' : 'No options available'}</option>
                    {sizes.map(s => <option key={s.id} value={`${s.length}x${s.breadth}`}>{`${s.length}x${s.breadth}`}</option>)}
                  </select>
                  <button 
                    className="btn btn-outline-success" 
                    type="button"
                    onClick={() => setShowSizeModal(true)}
                    disabled={loading}
                    title="Add new size"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <label className="form-label">Quantity <span className="text-danger">*</span></label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity (minimum 1)"
                  min="1"
                  required
                />
                {quantity && parseInt(quantity) < 1 && (
                  <div className="text-danger small mt-1">Minimum quantity is 1</div>
                )}
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <label className="form-label">Base Price (per unit)</label>
                <div className="input-group">
                  <input 
                    type="text" 
                    className="form-control" 
                    value={basePrice || ''} 
                    readOnly 
                    placeholder={quantity && parseInt(quantity) >= 1 ? "Select specifications above" : "Enter quantity first"}
                  />
                  <button 
                    className="btn btn-outline-success" 
                    type="button"
                    onClick={() => setShowPriceModal(true)}
                    disabled={loading}
                    title="Add new price"
                  >
                    +
                  </button>
                </div>
                {!quantity && (
                  <div className="text-muted small mt-1">Enter quantity to see base price</div>
                )}
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <label className="form-label">Discount</label>
                <select className="form-select" value={discount} onChange={(e) => setDiscount(e.target.value)}>
                  <option value="">No Discount</option>
                  <option value="5">5%</option>
                  <option value="10">10%</option>
                  <option value="15">15%</option>
                </select>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <label className="form-label">Total Price</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={totalPrice || ''} 
                  readOnly 
                  placeholder="Calculated automatically"
                />
              </div>
            </div>
          </div>
          <div className="col-12 col-md-2 text-md-end">
            <div className="d-flex flex-column gap-2">
              <button 
                className="btn btn-primary w-100 w-md-auto" 
                onClick={showFullSheetQuotation} 
                disabled={!hasProductDetails || !quantity || !selectedSeries || !selectedThickness || !selectedSize || !totalPrice}
              >
                Get Quotation
              </button>
              <button 
                className="btn btn-success w-100 w-md-auto" 
                onClick={handleAddToCart} 
                disabled={!hasProductDetails || !selectedSeries || !selectedThickness || !selectedSize || !basePrice || !quantity || parseInt(quantity) < 1}
              >
                Add to Cart
              </button>
              <button 
                className="btn btn-info w-100 w-md-auto" 
                onClick={saveFullSheetsQuotation} 
                disabled={!hasProductDetails || !quantity || !selectedSeries || !selectedThickness || !selectedSize || !totalPrice || savingQuotation}
              >
                {savingQuotation ? 'Saving...' : 'Save Quotation'}
              </button>
            </div>
            {quoteMsg && <div className="small mt-2 text-muted">{quoteMsg}</div>}
            {quotationMessage && <div className={`small mt-2 ${quotationMessage.includes('successfully') ? 'text-success' : 'text-danger'}`}>{quotationMessage}</div>}
          </div>
        </div>
      )}

      {/* Cut-to-Size Sheets Tab Content */}
      {!loading && !error && activeTab === 'cut-to-size' && (
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-10">
            <div className="row g-3">
              <div className="col-12 col-sm-6 col-lg-4">
                <label className="form-label">Series</label>
                <div className="input-group">
                  <select className="form-select" value={selectedSeries} onChange={(e) => setSelectedSeries(e.target.value)} disabled={!hasProductDetails}>
                    <option value="">{hasProductDetails ? 'Select Series' : 'No options available'}</option>
                    {getUniqueSeries().map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                  <button 
                    className="btn btn-outline-success" 
                    type="button"
                    onClick={() => setShowSeriesModal(true)}
                    disabled={loading}
                    title="Add new series"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <label className="form-label">Thickness</label>
                <div className="input-group">
                  <select className="form-select" value={selectedThickness} onChange={(e) => setSelectedThickness(e.target.value)} disabled={!hasProductDetails}>
                    <option value="">{hasProductDetails ? 'Select Thickness' : 'No options available'}</option>
                    {thicknesses.map(t => <option key={t.id} value={t.thicknessName}>{t.thicknessName}</option>)}
                  </select>
                  <button 
                    className="btn btn-outline-success" 
                    type="button"
                    onClick={() => setShowThicknessModal(true)}
                    disabled={loading}
                    title="Add new thickness"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <label className="form-label">Size (Full Sheet)</label>
                <div className="input-group">
                  <select className="form-select" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} disabled={!hasProductDetails}>
                    <option value="">{hasProductDetails ? 'Select Size' : 'No options available'}</option>
                    {sizes.map(s => <option key={s.id} value={`${s.length}x${s.breadth}`}>{`${s.length}x${s.breadth}`}</option>)}
                  </select>
                  <button 
                    className="btn btn-outline-success" 
                    type="button"
                    onClick={() => setShowSizeModal(true)}
                    disabled={loading}
                    title="Add new size"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="col-12 col-sm-6 col-lg-4">
                <label className="form-label">Cut Length <span className="text-danger">*</span></label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={cutLength} 
                  onChange={(e) => setCutLength(e.target.value)}
                  placeholder="Enter length"
                  step="0.01"
                  min="0.01"
                  required
                />
                {cutLength && parseFloat(cutLength) <= 0 && (
                  <div className="text-danger small mt-1">Length must be greater than 0</div>
                )}
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <label className="form-label">Cut Width <span className="text-danger">*</span></label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={cutWidth} 
                  onChange={(e) => setCutWidth(e.target.value)}
                  placeholder="Enter width"
                  step="0.01"
                  min="0.01"
                  required
                />
                {cutWidth && parseFloat(cutWidth) <= 0 && (
                  <div className="text-danger small mt-1">Width must be greater than 0</div>
                )}
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <label className="form-label">Machining Cost</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={machiningCost} 
                  onChange={(e) => setMachiningCost(e.target.value)}
                  placeholder="Enter machining cost"
                  step="0.01"
                  min="0"
                />
                {machiningCost && parseFloat(machiningCost) < 0 && (
                  <div className="text-danger small mt-1">Machining cost cannot be negative</div>
                )}
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <label className="form-label">Cut Size Area</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={cutSizeArea ? `${cutSizeArea} sq units` : ''} 
                  readOnly 
                  placeholder="Length × Width"
                />
                {cutLength && cutWidth && !cutSizeArea && (
                  <div className="text-muted small mt-1">Enter both length and width</div>
                )}
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <label className="form-label">Quantity per Sheet</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={quantityPerSheet ? `${quantityPerSheet} pieces` : ''} 
                  readOnly 
                  placeholder="Auto-calculated"
                />
                {cutLength && cutWidth && selectedSize && !quantityPerSheet && (
                  <div className="text-muted small mt-1">Select full sheet size</div>
                )}
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <label className="form-label">Number of Full Sheets Required</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={numberOfFullSheetsRequired ? `${numberOfFullSheetsRequired} sheets` : ''} 
                  readOnly 
                  placeholder="Auto-calculated"
                />
                {quantity && quantityPerSheet && !numberOfFullSheetsRequired && (
                  <div className="text-muted small mt-1">Enter quantity</div>
                )}
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <label className="form-label">Quantity <span className="text-danger">*</span></label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity (minimum 1)"
                  min="1"
                  required
                />
                {quantity && parseInt(quantity) < 1 && (
                  <div className="text-danger small mt-1">Minimum quantity is 1</div>
                )}
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <label className="form-label">Base Price (Full Sheet)</label>
                <div className="input-group">
                  <input 
                    type="text" 
                    className="form-control" 
                    value={fullSheetPrice || ''} 
                    readOnly 
                    placeholder="Select Series, Thickness & Size"
                  />
                  <button 
                    className="btn btn-outline-success" 
                    type="button"
                    onClick={() => setShowPriceModal(true)}
                    disabled={loading}
                    title="Add new price"
                  >
                    +
                  </button>
                </div>
                {!fullSheetPrice && (
                  <div className="text-muted small mt-1">Select Series, Thickness & Size to see base price</div>
                )}
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <label className="form-label">Cut-to-Size Price Per Unit</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={pricePerUnit ? parseFloat(pricePerUnit).toFixed(2) : ''} 
                  readOnly 
                  placeholder="Enter quantity to calculate"
                />
                {!pricePerUnit && (
                  <div className="text-muted small mt-1">Enter quantity to calculate per-unit price</div>
                )}
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <label className="form-label">Total Calculated Price</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={calculatedPrice ? parseFloat(calculatedPrice).toFixed(2) : ''} 
                  readOnly 
                  placeholder="Enter quantity to calculate"
                />
                {!calculatedPrice && (
                  <div className="text-muted small mt-1">Enter quantity to calculate total price</div>
                )}
              </div>
            </div>
          </div>
          <div className="col-12 col-md-2 text-md-end">
            <div className="d-flex flex-column gap-2">
              <button 
                className="btn btn-primary w-100 w-md-auto" 
                onClick={showCutSizeQuotation} 
                disabled={!hasProductDetails || !quantity || !selectedSeries || !selectedThickness || !selectedSize || !cutLength || !cutWidth || !calculatedPrice}
              >
                Get Quotation
              </button>
              <button 
                className="btn btn-success w-100 w-md-auto" 
                onClick={handleAddToCart} 
                disabled={!hasProductDetails || !selectedSeries || !selectedThickness || !selectedSize || !basePrice || !quantity || parseInt(quantity) < 1}
              >
                Add to Cart
              </button>
              <button 
                className="btn btn-info w-100 w-md-auto" 
                onClick={saveCutToSizeQuotation} 
                disabled={!hasProductDetails || !quantity || !selectedSeries || !selectedThickness || !selectedSize || !cutLength || !cutWidth || !calculatedPrice || savingQuotation}
              >
                {savingQuotation ? 'Saving...' : 'Save Quotation'}
              </button>
            </div>
            {quotationMessage && <div className={`small mt-2 ${quotationMessage.includes('successfully') ? 'text-success' : 'text-danger'}`}>{quotationMessage}</div>}
          </div>
        </div>
      )}

      {/* Minimum Order Notice */}
      {!loading && !error && (
        <div className="mt-4 p-3 bg-light rounded">
          <div className="text-center">
            <small className="text-muted">
              $25.00 Minimum Line Item. Minimum Order: $25 USA, $150 Canada/Mexico/PR/VI, $250 International
            </small>
          </div>
        </div>
      )}

      {/* Series Modal */}
      <div className={`modal ${showSeriesModal ? 'show' : ''}`} style={{ display: showSeriesModal ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Series</h5>
              <button type="button" className="btn-close" onClick={handleSeriesModalClose}></button>
            </div>
            <form onSubmit={handleSeriesSubmit}>
              <div className="modal-body">
                {seriesError && <div className="alert alert-danger">{seriesError}</div>}
                {seriesSuccess && <div className="alert alert-success">{seriesSuccess}</div>}
                
                <div className="mb-3">
                  <label className="form-label">Series Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={seriesFormData.series} 
                    onChange={(e) => setSeriesFormData({...seriesFormData, series: e.target.value})}
                    placeholder="Enter series name"
                    required 
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleSeriesModalClose}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={seriesLoading}
                >
                  {seriesLoading ? 'Adding...' : 'Add Series'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Thickness Modal */}
      <div className={`modal ${showThicknessModal ? 'show' : ''}`} style={{ display: showThicknessModal ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Thickness</h5>
              <button type="button" className="btn-close" onClick={handleThicknessModalClose}></button>
            </div>
            <form onSubmit={handleThicknessSubmit}>
              <div className="modal-body">
                {thicknessError && <div className="alert alert-danger">{thicknessError}</div>}
                {thicknessSuccess && <div className="alert alert-success">{thicknessSuccess}</div>}
                
                <div className="mb-3">
                  <label className="form-label">Thickness (mm)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    min="0.1"
                    className="form-control" 
                    value={thicknessFormData.thickness} 
                    onChange={(e) => setThicknessFormData({...thicknessFormData, thickness: e.target.value})}
                    placeholder="e.g., 2.5"
                    required 
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleThicknessModalClose}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={thicknessLoading}
                >
                  {thicknessLoading ? 'Adding...' : 'Add Thickness'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Size Modal */}
      <div className={`modal ${showSizeModal ? 'show' : ''}`} style={{ display: showSizeModal ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Size</h5>
              <button type="button" className="btn-close" onClick={handleSizeModalClose}></button>
            </div>
            <form onSubmit={handleSizeSubmit}>
              <div className="modal-body">
                {sizeError && <div className="alert alert-danger">{sizeError}</div>}
                {sizeSuccess && <div className="alert alert-success">{sizeSuccess}</div>}
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Length (mm)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={sizeFormData.length} 
                        onChange={(e) => setSizeFormData({...sizeFormData, length: e.target.value})}
                        placeholder="e.g., 1220"
                        min="1"
                        required 
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Breadth (mm)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={sizeFormData.breadth} 
                        onChange={(e) => setSizeFormData({...sizeFormData, breadth: e.target.value})}
                        placeholder="e.g., 2420"
                        min="1"
                        required 
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleSizeModalClose}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={sizeLoading}
                >
                  {sizeLoading ? 'Adding...' : 'Add Size'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Price Modal */}
      <div className={`modal ${showPriceModal ? 'show' : ''}`} style={{ display: showPriceModal ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Price</h5>
              <button type="button" className="btn-close" onClick={handlePriceModalClose}></button>
            </div>
            <form onSubmit={handlePriceSubmit}>
              <div className="modal-body">
                {priceError && <div className="alert alert-danger">{priceError}</div>}
                {priceSuccess && <div className="alert alert-success">{priceSuccess}</div>}
                
                <div className="mb-3">
                  <label className="form-label">Product Detail (Series)</label>
                  <select 
                    className="form-select" 
                    value={priceFormData.productDetailId} 
                    onChange={(e) => setPriceFormData({...priceFormData, productDetailId: e.target.value})}
                    required
                  >
                    <option value="">Select Series</option>
                    {productDetails.map(pd => <option key={pd.id} value={pd.id}>{pd.series}</option>)}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Thickness</label>
                  <select 
                    className="form-select" 
                    value={priceFormData.thicknessId} 
                    onChange={(e) => setPriceFormData({...priceFormData, thicknessId: e.target.value})}
                    required
                  >
                    <option value="">Select Thickness</option>
                    {thicknesses.map(t => <option key={t.id} value={t.id}>{t.thicknessName}</option>)}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Size</label>
                  <select 
                    className="form-select" 
                    value={priceFormData.sizeId} 
                    onChange={(e) => setPriceFormData({...priceFormData, sizeId: e.target.value})}
                    required
                  >
                    <option value="">Select Size</option>
                    {sizes.map(s => <option key={s.id} value={s.id}>{`${s.length}x${s.breadth}`}</option>)}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-control" 
                    value={priceFormData.price} 
                    onChange={(e) => setPriceFormData({...priceFormData, price: e.target.value})}
                    placeholder="Enter price"
                    required 
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handlePriceModalClose}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={priceLoading}
                >
                  {priceLoading ? 'Adding...' : 'Add Price'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bootstrap Modal for Cut To Size Quotation */}
      <div className={`modal ${showCutSizeModal ? 'show' : ''}`} style={{ display: showCutSizeModal ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Cut To Size Quotation</h5>
              <button type="button" className="btn-close" onClick={() => setShowCutSizeModal(false)}></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-12">
                  <h6 className="text-primary mb-3">Quotation Details</h6>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <tbody>
                        <tr>
                          <td><strong>Grade:</strong></td>
                          <td>{gradeName}</td>
                        </tr>
                        <tr>
                          <td><strong>Quantity:</strong></td>
                          <td>{quantity}</td>
                        </tr>
                        <tr>
                          <td><strong>Thickness:</strong></td>
                          <td>{selectedThickness}</td>
                        </tr>
                        <tr>
                          <td><strong>Series:</strong></td>
                          <td>{selectedSeries}</td>
                        </tr>
                        <tr>
                          <td><strong>Full Sheet Size:</strong></td>
                          <td>{selectedSize}</td>
                        </tr>
                        <tr>
                          <td><strong>Cut Length:</strong></td>
                          <td>{cutLength}</td>
                        </tr>
                        <tr>
                          <td><strong>Cut Width:</strong></td>
                          <td>{cutWidth}</td>
                        </tr>
                        <tr>
                          <td><strong>Cut Size Area:</strong></td>
                          <td>{cutSizeArea} sq units</td>
                        </tr>
                        <tr>
                          <td><strong>Quantity per Sheet:</strong></td>
                          <td>{quantityPerSheet} pieces</td>
                        </tr>
                        <tr>
                          <td><strong>Number of Full Sheets Required:</strong></td>
                          <td>{numberOfFullSheetsRequired} sheets</td>
                        </tr>
                        <tr>
                          <td><strong>Base Price (Full Sheet):</strong></td>
                          <td>{fullSheetPrice}</td>
                        </tr>
                        <tr>
                          <td><strong>Cut-to-Size Price Per Unit:</strong></td>
                          <td>{parseFloat(pricePerUnit).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td><strong>Machining Cost:</strong></td>
                          <td>{machiningCost ? parseFloat(machiningCost).toFixed(2) : '0.00'}</td>
                        </tr>
                        <tr className="table-success">
                          <td><strong>Total Calculated Price:</strong></td>
                          <td><strong>{parseFloat(calculatedPrice).toFixed(2)}</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="alert alert-info mt-3">
                    <small>
                      <strong>Calculation:</strong><br/>
                      • Cut Size Area: {cutLength} × {cutWidth} = {cutSizeArea} sq units<br/>
                      • Quantity per Sheet: {quantityPerSheet} pieces (from {selectedSize} full sheet)<br/>
                      • Number of Full Sheets Required: {numberOfFullSheetsRequired} sheets<br/>
                      • Base Price: {fullSheetPrice}<br/>
                      • Number of Full Sheets Required: {numberOfFullSheetsRequired}<br/>
                      • Quantity: {quantity}<br/>
                      • Total Calculated Price: {fullSheetPrice} × {numberOfFullSheetsRequired} × {quantity} = {parseFloat(calculatedPrice).toFixed(2)}<br/>
                      • Cut-to-Size Price Per Unit: {fullSheetPrice} × {numberOfFullSheetsRequired} ÷ {quantity} = {parseFloat(pricePerUnit).toFixed(2)}
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowCutSizeModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap Modal for Full Sheets Quotation */}
      <div className={`modal ${showFullSheetModal ? 'show' : ''}`} style={{ display: showFullSheetModal ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Full Sheets Quotation</h5>
              <button type="button" className="btn-close" onClick={() => setShowFullSheetModal(false)}></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-12">
                  <h6 className="text-primary mb-3">Quotation Details</h6>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <tbody>
                        <tr>
                          <td><strong>Grade:</strong></td>
                          <td>{gradeName}</td>
                        </tr>
                        <tr>
                          <td><strong>Quantity:</strong></td>
                          <td>{quantity}</td>
                        </tr>
                        <tr>
                          <td><strong>Thickness:</strong></td>
                          <td>{selectedThickness}</td>
                        </tr>
                        <tr>
                          <td><strong>Series:</strong></td>
                          <td>{selectedSeries}</td>
                        </tr>
                        <tr>
                          <td><strong>Size:</strong></td>
                          <td>{selectedSize}</td>
                        </tr>
                        <tr>
                          <td><strong>Base Price (per unit):</strong></td>
                          <td>{basePrice}</td>
                        </tr>
                        <tr>
                          <td><strong>Discount:</strong></td>
                          <td>{discount ? `${discount}%` : 'No Discount'}</td>
                        </tr>
                        <tr className="table-success">
                          <td><strong>Total Price:</strong></td>
                          <td><strong>{totalPrice}</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="alert alert-info mt-3">
                    <small>
                      <strong>Calculation:</strong><br/>
                      • Base Price per unit: {basePrice}<br/>
                      • Quantity: {quantity}<br/>
                      • Subtotal: {basePrice} × {quantity} = {(parseFloat(basePrice) * parseInt(quantity)).toFixed(2)}<br/>
                      {discount ? `• Discount (${discount}%): ${((parseFloat(basePrice) * parseInt(quantity)) * (parseFloat(discount) / 100)).toFixed(2)}<br/>` : ''}
                      • Total Price: {totalPrice}
                    </small>
                  </div>
                  {quoteMsg && (
                    <div className="alert alert-success mt-3">
                      <small>{quoteMsg}</small>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowFullSheetModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bootstrap Modal for Add to Cart */}
      <div className={`modal ${showAddToCartModal ? 'show' : ''}`} style={{ display: showAddToCartModal ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add to Cart</h5>
              <button type="button" className="btn-close" onClick={() => setShowAddToCartModal(false)}></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-12">
                  <h6 className="text-primary mb-3">
                    {activeTab === 'cut-to-size' ? 'Cut-to-Size Specifications' : 'Product Details'}
                  </h6>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <tbody>
                        <tr>
                          <td><strong>Grade:</strong></td>
                          <td>{gradeName}</td>
                        </tr>
                        <tr>
                          <td><strong>Series:</strong></td>
                          <td>{selectedSeries}</td>
                        </tr>
                        <tr>
                          <td><strong>Thickness:</strong></td>
                          <td>{selectedThickness}</td>
                        </tr>
                        {activeTab === 'cut-to-size' ? (
                          <>
                            <tr>
                              <td><strong>Full Sheet Size:</strong></td>
                              <td>{selectedSize}</td>
                            </tr>
                            <tr>
                              <td><strong>Cut Length:</strong></td>
                              <td>{cutLength} mm</td>
                            </tr>
                            <tr>
                              <td><strong>Cut Width:</strong></td>
                              <td>{cutWidth} mm</td>
                            </tr>
                            <tr>
                              <td><strong>Cut Size Area:</strong></td>
                              <td>{cutSizeArea} sq mm</td>
                            </tr>
                            <tr>
                              <td><strong>Quantity per Sheet:</strong></td>
                              <td>{quantityPerSheet} pieces</td>
                            </tr>
                            <tr>
                              <td><strong>Number of Full Sheets Required:</strong></td>
                              <td>{numberOfFullSheetsRequired} sheets</td>
                            </tr>
                            <tr>
                              <td><strong>Base Price (Full Sheet):</strong></td>
                              <td>₹{fullSheetPrice}</td>
                            </tr>
                            <tr>
                              <td><strong>Machining Cost:</strong></td>
                              <td>₹{machiningCost ? parseFloat(machiningCost).toFixed(2) : '0.00'}</td>
                            </tr>
                            <tr>
                              <td><strong>Cut-to-Size Price Per Unit:</strong></td>
                              <td>₹{pricePerUnit ? parseFloat(pricePerUnit).toFixed(2) : '0.00'}</td>
                            </tr>
                          </>
                        ) : (
                          <>
                            <tr>
                              <td><strong>Size:</strong></td>
                              <td>{selectedSize}</td>
                            </tr>
                            <tr>
                              <td><strong>Unit Price:</strong></td>
                              <td>₹{basePrice}</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Quantity</label>
                    <div className="form-control-plaintext bg-light p-2 rounded">
                      <strong>{quantity}</strong>
                    </div>
                  </div>
                  <div className="alert alert-info">
                    <strong>Total Price:</strong> ₹{activeTab === 'cut-to-size' 
                      ? (calculatedPrice ? parseFloat(calculatedPrice).toFixed(2) : '0.00')
                      : (totalPrice ? parseFloat(totalPrice).toFixed(2) : '0.00')
                    }
                  </div>
                  {cartMessage && (
                    <div className={`alert ${cartMessage.includes('successfully') ? 'alert-success' : 'alert-danger'} mt-3`}>
                      <small>{cartMessage}</small>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddToCartModal(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-success" onClick={submitAddToCart}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSeriesModal && <div className="modal-backdrop fade show"></div>}
      {showThicknessModal && <div className="modal-backdrop fade show"></div>}
      {showSizeModal && <div className="modal-backdrop fade show"></div>}
      {showPriceModal && <div className="modal-backdrop fade show"></div>}
      {showCutSizeModal && <div className="modal-backdrop fade show"></div>}
      {showFullSheetModal && <div className="modal-backdrop fade show"></div>}
      {showAddToCartModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default ProductDetailsPage;


