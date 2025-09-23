import { useState, useEffect } from 'react';
import api from '../services/api';

function QuotationsHistoryPage() {
  const [fullSheetsQuotations, setFullSheetsQuotations] = useState([]);
  const [cutToSizeQuotations, setCutToSizeQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('full-sheets');
  const [removingAll, setRemovingAll] = useState(false);

  useEffect(() => {
    loadQuotations();
  }, []);

  const loadQuotations = async () => {
    try {
      setLoading(true);
      setError('');

      const [fullSheetsResponse, cutToSizeResponse] = await Promise.all([
        api.get('/quotations/full-sheets'),
        api.get('/quotations/cut-to-size')
      ]);

      setFullSheetsQuotations(fullSheetsResponse.data);
      setCutToSizeQuotations(cutToSizeResponse.data);
    } catch (err) {
      setError('Failed to load quotations: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  const downloadPDF = (quotation, type) => {
    // Dynamic import of jsPDF to avoid SSR issues
    import('jspdf').then(({ default: jsPDF }) => {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text(`${type === 'full-sheets' ? 'Full Sheets' : 'Cut-to-Size'} Quotation`, 20, 20);
      
      // Add quotation details
      doc.setFontSize(12);
      let yPosition = 40;
      
      if (type === 'full-sheets') {
        doc.text(`Series: ${quotation.series}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Thickness: ${quotation.thickness}mm`, 20, yPosition);
        yPosition += 10;
        doc.text(`Size: ${quotation.size}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Quantity: ${quotation.quantity}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Base Price: ${formatCurrency(quotation.basePrice)}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Total Price: ${formatCurrency(quotation.totalPrice)}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Grade: ${quotation.gradeName}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Created: ${formatDate(quotation.createdAt)}`, 20, yPosition);
      } else {
        doc.text(`Series: ${quotation.series}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Thickness: ${quotation.thickness}mm`, 20, yPosition);
        yPosition += 10;
        doc.text(`Full Sheet Size: ${quotation.sizeFullSheet}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Cut Length: ${quotation.cutLength}mm`, 20, yPosition);
        yPosition += 10;
        doc.text(`Cut Width: ${quotation.cutWidth}mm`, 20, yPosition);
        yPosition += 10;
        doc.text(`Cut Size Area: ${quotation.cutSizeArea}mm²`, 20, yPosition);
        yPosition += 10;
        doc.text(`Machining Cost: ${formatCurrency(quotation.machiningCost)}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Quantity per Sheet: ${quotation.quantityPerSheet}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Number of Full Sheets Required: ${quotation.numFullSheetsRequired}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Quantity: ${quotation.quantity}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Base Price Full Sheet: ${formatCurrency(quotation.basePriceFullSheet)}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Cut-to-Size Price per Unit: ${formatCurrency(quotation.cutToSizePricePerUnit)}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Total Calculated Price: ${formatCurrency(quotation.totalCalculatedPrice)}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Grade: ${quotation.gradeName}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Created: ${formatDate(quotation.createdAt)}`, 20, yPosition);
      }
      
      // Save the PDF
      doc.save(`${type}-quotation-${quotation.id}.pdf`);
    }).catch(err => {
      console.error('Error generating PDF:', err);
      alert('Error generating PDF. Please try again.');
    });
  };

  const handleRemoveAll = async () => {
    const confirmMessage = `Are you sure you want to remove all quotations?\n\nThis will delete:\n- ${fullSheetsQuotations.length} Full Sheets quotations\n- ${cutToSizeQuotations.length} Cut-to-Size quotations\n\nThis action cannot be undone.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setRemovingAll(true);
    setError('');

    try {
      // Delete all full sheets quotations
      if (fullSheetsQuotations.length > 0) {
        await api.delete('/quotations/full-sheets/all');
      }

      // Delete all cut-to-size quotations
      if (cutToSizeQuotations.length > 0) {
        await api.delete('/quotations/cut-to-size/all');
      }

      // Reload quotations to update the UI
      await loadQuotations();
      
      alert('All quotations have been successfully removed.');
    } catch (err) {
      setError('Failed to remove quotations: ' + (err.response?.data?.message || err.message));
    } finally {
      setRemovingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quotations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={loadQuotations}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quotations History</h1>
          <p className="mt-2 text-gray-600">View and download your saved quotations</p>
        </div>

        {/* Tabs and Remove All Button */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div className="border-b border-gray-200 flex-1">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('full-sheets')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'full-sheets'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Full Sheets Quotations ({fullSheetsQuotations.length})
                </button>
                <button
                  onClick={() => setActiveTab('cut-to-size')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'cut-to-size'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Cut-to-Size Quotations ({cutToSizeQuotations.length})
                </button>
              </nav>
            </div>
            {(fullSheetsQuotations.length > 0 || cutToSizeQuotations.length > 0) && (
              <button
                onClick={handleRemoveAll}
                disabled={removingAll}
                className="ml-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {removingAll ? 'Removing...' : 'Remove All'}
              </button>
            )}
          </div>
        </div>

        {/* Full Sheets Quotations */}
        {activeTab === 'full-sheets' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Full Sheets Quotations</h2>
            </div>
            {fullSheetsQuotations.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No full sheets quotations found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Series
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thickness
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Base Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fullSheetsQuotations.map((quotation) => (
                      <tr key={quotation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {quotation.series}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {quotation.thickness}mm
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {quotation.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {quotation.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(quotation.basePrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(quotation.totalPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {quotation.gradeName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(quotation.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => downloadPDF(quotation, 'full-sheets')}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Download PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Cut-to-Size Quotations */}
        {activeTab === 'cut-to-size' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Cut-to-Size Quotations</h2>
            </div>
            {cutToSizeQuotations.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No cut-to-size quotations found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Series
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thickness
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Full Sheet Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cut Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cutToSizeQuotations.map((quotation) => (
                      <tr key={quotation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {quotation.series}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {quotation.thickness}mm
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {quotation.sizeFullSheet}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {quotation.cutLength} × {quotation.cutWidth}mm
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {quotation.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(quotation.totalCalculatedPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {quotation.gradeName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(quotation.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => downloadPDF(quotation, 'cut-to-size')}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Download PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuotationsHistoryPage;
