import React from 'react';
import { useApp } from '../../context/AppContext';
import BarcodeComponent from './Barcode';
import { XMarkIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

const BarcodeModal = ({ product, onClose }) => {
  const { settings } = useApp();

  if (!product) return null;

  const generateBarcodeValue = () => {
    const prefix = settings.barcodeSettings?.productPrefix || 'ALM';
    return `${prefix}-${product.sku || product.id}`;
  };

  const handlePrint = () => {
    const printContent = document.getElementById('barcode-print-area');
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Code-barres du produit
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Product Info */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">{product.name}</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">SKU:</span> {product.sku}</p>
              <p><span className="font-medium">Catégorie:</span> {product.category}</p>
              <p><span className="font-medium">Prix:</span> {product.price.toLocaleString()} F CFA</p>
            </div>
          </div>

          {/* Barcode Display */}
          <div id="barcode-print-area" className="text-center bg-white p-4 border rounded-lg">
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-900 mb-2">
                {product.name}
              </h5>
              <p className="text-xs text-gray-600">SKU: {product.sku}</p>
            </div>
            
            <div className="flex justify-center mb-4">
              <BarcodeComponent
                value={generateBarcodeValue()}
                format={settings.barcodeSettings?.productFormat || 'CODE128'}
                width={2}
                height={80}
                fontSize={12}
                displayValue={true}
              />
            </div>
            
            <div className="text-xs text-gray-500">
              <p>{product.price.toLocaleString()} F CFA</p>
              <p>Al Madinah Boutique</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              Imprimer
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeModal;
