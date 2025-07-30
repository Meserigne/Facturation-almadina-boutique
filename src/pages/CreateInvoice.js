import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  UserIcon,
  CubeIcon,
  DocumentTextIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const CreateInvoice = () => {
  const { products, clients, paymentMethods, actions, settings } = useApp();
  const navigate = useNavigate();
  
  const [currentInvoice, setCurrentInvoice] = useState({
    client: null,
    items: [],
    date: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    notes: '',
    status: 'draft'
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showClientSelector, setShowClientSelector] = useState(false);
  const [showProductSelector, setShowProductSelector] = useState(false);

  // Filter products for selection
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.stock > 0;
  });

  const addToInvoice = (product) => {
    const existingItem = currentInvoice.items.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCurrentInvoice(prev => ({
          ...prev,
          items: prev.items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }));
      }
    } else {
      setCurrentInvoice(prev => ({
        ...prev,
        items: [...prev.items, { ...product, quantity: 1 }]
      }));
    }
    setShowProductSelector(false);
  };

  const removeFromInvoice = (productId) => {
    setCurrentInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== productId)
    }));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromInvoice(productId);
      return;
    }
    
    const product = products.find(p => p.id === productId);
    if (quantity > product.stock) {
      alert(`Stock insuffisant. Maximum disponible: ${product.stock}`);
      return;
    }

    setCurrentInvoice(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    }));
  };

  const calculateSubtotal = () => {
    return currentInvoice.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    if (!settings.invoiceSettings.showTax) return 0;
    return calculateSubtotal() * (settings.invoiceSettings.taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const generateInvoiceNumber = () => {
    const prefix = settings.invoiceSettings.prefix;
    const nextNumber = settings.invoiceSettings.startNumber + 1;
    return `${prefix}-${String(nextNumber).padStart(6, '0')}`;
  };

  const saveInvoice = (status = 'draft') => {
    if (!currentInvoice.client) {
      alert('Veuillez sélectionner un client');
      return;
    }

    if (currentInvoice.items.length === 0) {
      alert('Veuillez ajouter au moins un produit');
      return;
    }

    const invoice = {
      id: Date.now(),
      number: generateInvoiceNumber(),
      ...currentInvoice,
      status,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal(),
      createdAt: new Date().toISOString()
    };

    actions.addInvoice(invoice);
    
    // Update product stock
    currentInvoice.items.forEach(item => {
      const newStock = products.find(p => p.id === item.id).stock - item.quantity;
      actions.updateStock(item.id, newStock);
    });

    alert(`Facture ${status === 'draft' ? 'sauvegardée' : 'créée'} avec succès !`);
    navigate('/invoices');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/invoices')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nouvelle facture</h1>
            <p className="text-sm text-gray-600">Créez une nouvelle facture pour vos clients</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => saveInvoice('draft')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Sauvegarder brouillon
          </button>
          <button
            onClick={() => saveInvoice('pending')}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
          >
            Créer la facture
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column - Invoice details */}
        <div className="space-y-6">
          {/* Invoice info */}
          <div className="bg-white rounded-lg shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de la facture</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de facturation
                </label>
                <input
                  type="date"
                  value={currentInvoice.date}
                  onChange={(e) => setCurrentInvoice(prev => ({...prev, date: e.target.value}))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client *
                </label>
                {currentInvoice.client ? (
                  <div className="flex items-center justify-between p-3 bg-primary-50 border border-primary-200 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{currentInvoice.client.name}</p>
                        <p className="text-sm text-gray-600">{currentInvoice.client.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowClientSelector(true)}
                      className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                    >
                      Changer
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowClientSelector(true)}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-primary-300 hover:text-primary-600 transition-colors"
                  >
                    <UserIcon className="w-6 h-6 mx-auto mb-2" />
                    Sélectionner un client
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mode de paiement
                </label>
                <select
                  value={currentInvoice.paymentMethod}
                  onChange={(e) => setCurrentInvoice(prev => ({...prev, paymentMethod: e.target.value}))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Sélectionner un mode de paiement</option>
                  {paymentMethods.map(method => (
                    <option key={method.id} value={method.id}>
                      {method.icon} {method.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={currentInvoice.notes}
                  onChange={(e) => setCurrentInvoice(prev => ({...prev, notes: e.target.value}))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Notes additionnelles..."
                />
              </div>
            </div>
          </div>

          {/* Invoice items */}
          <div className="bg-white rounded-lg shadow-soft p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Articles de la facture</h3>
              <button
                onClick={() => setShowProductSelector(true)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 border border-primary-200 rounded-md hover:bg-primary-100"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Ajouter un produit
              </button>
            </div>

            {currentInvoice.items.length === 0 ? (
              <div className="text-center py-8">
                <CubeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun article ajouté</p>
                <button
                  onClick={() => setShowProductSelector(true)}
                  className="mt-2 text-primary-600 hover:text-primary-800 text-sm font-medium"
                >
                  Ajouter votre premier produit
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {currentInvoice.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.category}</p>
                      <p className="text-sm text-gray-500">
                        {item.price.toLocaleString()} F CFA × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 bg-white border border-gray-300 rounded-md"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 bg-white border border-gray-300 rounded-md"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <p className="font-semibold text-gray-900">
                          {(item.price * item.quantity).toLocaleString()} F CFA
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromInvoice(item.id)}
                        className="text-danger-600 hover:text-danger-800"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Totals */}
            {currentInvoice.items.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sous-total:</span>
                    <span className="font-medium">{calculateSubtotal().toLocaleString()} F CFA</span>
                  </div>
                  {settings.invoiceSettings.showTax && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">TVA ({settings.invoiceSettings.taxRate}%):</span>
                      <span className="font-medium">{calculateTax().toLocaleString()} F CFA</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-primary-600">{calculateTotal().toLocaleString()} F CFA</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column - Product/Client selection */}
        <div className="space-y-6">
          {/* Client selector */}
          {showClientSelector && (
            <div className="bg-white rounded-lg shadow-soft p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Sélectionner un client</h3>
                <button
                  onClick={() => setShowClientSelector(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {clients.map(client => (
                  <button
                    key={client.id}
                    onClick={() => {
                      setCurrentInvoice(prev => ({...prev, client}));
                      setShowClientSelector(false);
                    }}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{client.name}</p>
                        <p className="text-sm text-gray-600">{client.email}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product selector */}
          {showProductSelector && (
            <div className="bg-white rounded-lg shadow-soft p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Sélectionner des produits</h3>
                <button
                  onClick={() => setShowProductSelector(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              {/* Search and filter */}
              <div className="space-y-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher des produits..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Toutes les catégories</option>
                  {[...new Set(products.map(p => p.category))].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-600">{product.category}</p>
                      <p className="text-sm font-semibold text-primary-600">
                        {product.price.toLocaleString()} F CFA
                      </p>
                      <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                    </div>
                    <button
                      onClick={() => addToInvoice(product)}
                      className="px-3 py-1 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                    >
                      Ajouter
                    </button>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-8">
                  <CubeIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Aucun produit disponible</p>
                </div>
              )}
            </div>
          )}

          {/* Invoice preview */}
          {!showClientSelector && !showProductSelector && (
            <div className="bg-white rounded-lg shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                Aperçu de la facture
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Numéro:</span>
                  <span className="font-mono">{generateInvoiceNumber()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{new Date(currentInvoice.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Client:</span>
                  <span>{currentInvoice.client?.name || 'Non sélectionné'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Articles:</span>
                  <span>{currentInvoice.items.length}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span className="text-primary-600">{calculateTotal().toLocaleString()} F CFA</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
