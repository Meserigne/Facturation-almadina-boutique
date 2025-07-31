import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import BarcodeComponent from '../components/UI/Barcode';
import BarcodeModal from '../components/UI/BarcodeModal';
import imageService from '../services/imageService';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline';
import ProductForm from '../components/Forms/ProductForm';
import ConfirmDialog from '../components/UI/ConfirmDialog';

const Products = () => {
  const { products, categories, actions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [barcodeProduct, setBarcodeProduct] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      actions.deleteProduct(productToDelete.id);
      setShowDeleteDialog(false);
      setProductToDelete(null);
    }
  };

  const handleSave = (productData) => {
    if (editingProduct) {
      actions.updateProduct({ ...productData, id: editingProduct.id });
    } else {
      actions.addProduct(productData);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const getStockStatus = (product) => {
    if (product.stock === 0) {
      return { status: 'out', color: 'text-danger-600 bg-danger-50', label: 'Rupture' };
    } else if (product.stock <= product.minStock) {
      return { status: 'low', color: 'text-warning-600 bg-warning-50', label: 'Stock faible' };
    } else {
      return { status: 'good', color: 'text-success-600 bg-success-50', label: 'En stock' };
    }
  };

  const totalValue = filteredProducts.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des produits</h1>
          <p className="mt-1 text-sm text-gray-600">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} • 
            Valeur totale: {totalValue.toLocaleString()} F CFA
            {lowStockCount > 0 && (
              <span className="ml-2 text-warning-600">
                • {lowStockCount} produit{lowStockCount > 1 ? 's' : ''} en stock faible
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Ajouter un produit
        </button>
      </div>

      {/* Filters and search */}
      <div className="bg-white rounded-lg shadow-soft p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher par nom, description ou SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Category filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="name-asc">Nom A-Z</option>
              <option value="name-desc">Nom Z-A</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="stock-asc">Stock croissant</option>
              <option value="stock-desc">Stock décroissant</option>
              <option value="createdAt-desc">Plus récent</option>
              <option value="createdAt-asc">Plus ancien</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => {
          const stockStatus = getStockStatus(product);
          const productImage = imageService.getProductImage(product.id);
          const localImage = productImage;
          
          return (
            <div key={product.id} className="bg-white rounded-lg shadow-soft overflow-hidden card-hover">
              {/* Product image */}
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                ) : localImage ? (
                  <img
                    src={localImage.imageData}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                    <PhotoIcon className="w-12 h-12 text-gray-400" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-gray-500 mt-16">Aucune image</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Product info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="p-1 text-gray-400 hover:text-danger-600 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{product.description}</p>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">SKU:</span>
                    <span className="text-sm font-mono text-gray-900">{product.sku}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Prix:</span>
                    <span className="text-lg font-bold text-primary-600">
                      {product.price.toLocaleString()} F CFA
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Stock:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold">{product.stock}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                    </div>
                  </div>

                  {product.stock <= product.minStock && (
                    <div className="flex items-center space-x-1 text-warning-600 text-xs">
                      <ExclamationTriangleIcon className="w-3 h-3" />
                      <span>Seuil minimum: {product.minStock}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Fournisseur: {product.supplier}
                  </p>
                  <p className="text-xs text-gray-500">
                    Ajouté le: {new Date(product.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-lg shadow-soft p-12 text-center">
          <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCategory
              ? 'Aucun produit ne correspond à vos critères de recherche.'
              : 'Commencez par ajouter votre premier produit.'}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Ajouter un produit
          </button>
        </div>
      )}

      {/* Product form modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Delete confirmation dialog */}
      {showDeleteDialog && (
        <ConfirmDialog
          title="Supprimer le produit"
          message={`Êtes-vous sûr de vouloir supprimer "${productToDelete?.name}" ? Cette action est irréversible.`}
          confirmText="Supprimer"
          cancelText="Annuler"
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteDialog(false);
            setProductToDelete(null);
          }}
          type="danger"
        />
      )}
    </div>
  );
};

export default Products;
