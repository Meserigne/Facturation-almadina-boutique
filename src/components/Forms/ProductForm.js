import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import ImageUpload from '../UI/ImageUpload';
import imageService from '../../services/imageService';

const ProductForm = ({ product, onSave, onCancel }) => {
  const { categories } = useApp();
  const [formData, setFormData] = useState(product || {
    name: '',
    category: categories[0] || '',
    price: '',
    stock: '',
    minStock: '',
    description: '',
    sku: '',
    supplier: '',
    image: ''
  });
  const [errors, setErrors] = useState({});
  const [productImage, setProductImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [useImageUpload, setUseImageUpload] = useState(true); // Upload local activé par défaut

  // Charger l'image existante si on modifie un produit
  useEffect(() => {
    if (product && product.id) {
      const existingImage = imageService.getProductImage(product.id);
      if (existingImage) {
        setProductImage(existingImage.imageData);
      }
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du produit est requis';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Le prix doit être supérieur à 0';
    }

    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = 'Le stock ne peut pas être négatif';
    }

    if (!formData.minStock || formData.minStock < 0) {
      newErrors.minStock = 'Le stock minimum ne peut pas être négatif';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'Le SKU est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      minStock: parseInt(formData.minStock),
      updatedAt: new Date().toISOString().split('T')[0]
    };

    if (!product) {
      productData.createdAt = new Date().toISOString().split('T')[0];
      productData.id = Date.now().toString(); // Générer un ID temporaire
    }

    // Sauvegarder l'image si elle a été uploadée
    if (productImage && imageFile) {
      const productId = product?.id || productData.id;
      try {
        imageService.saveProductImage(productId, productImage, imageFile.name);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'image:', error);
      }
    }

    onSave(productData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageSelect = (imageData, file) => {
    setProductImage(imageData);
    setImageFile(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {product ? 'Modifier le produit' : 'Ajouter un produit'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du produit *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.name ? 'border-danger-300' : 'border-gray-300'
                }`}
                placeholder="Ex: Abaya Moderne Noire"
              />
              {errors.name && <p className="mt-1 text-sm text-danger-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU *
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => handleChange('sku', e.target.value.toUpperCase())}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.sku ? 'border-danger-300' : 'border-gray-300'
                }`}
                placeholder="Ex: ABY-001"
              />
              {errors.sku && <p className="mt-1 text-sm text-danger-600">{errors.sku}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Fournisseur
            </label>
            <input
              type="text"
              value={formData.supplier}
              onChange={(e) => handleChange('supplier', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Nom du fournisseur"
            />
          </div>
          </div>

          {/* Pricing and stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix (F CFA) *
              </label>
              <input
                type="number"
                step="100"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.price ? 'border-danger-300' : 'border-gray-300'
                }`}
                placeholder="25000"
              />
              {errors.price && <p className="mt-1 text-sm text-danger-600">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock actuel *
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.stock ? 'border-danger-300' : 'border-gray-300'
                }`}
                placeholder="25"
              />
              {errors.stock && <p className="mt-1 text-sm text-danger-600">{errors.stock}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock minimum *
              </label>
              <input
                type="number"
                min="0"
                value={formData.minStock}
                onChange={(e) => handleChange('minStock', e.target.value)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.minStock ? 'border-danger-300' : 'border-gray-300'
                }`}
                placeholder="5"
              />
              {errors.minStock && <p className="mt-1 text-sm text-danger-600">{errors.minStock}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Description détaillée du produit..."
            />
          </div>

          {/* Image Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image du produit
            </label>
            
            {/* Toggle between URL and Upload */}
            <div className="mb-4">
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="imageType"
                    checked={!useImageUpload}
                    onChange={() => setUseImageUpload(false)}
                    className="mr-2"
                  />
                  URL d'image
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="imageType"
                    checked={useImageUpload}
                    onChange={() => setUseImageUpload(true)}
                    className="mr-2"
                  />
                  Upload local
                </label>
              </div>
            </div>

            {useImageUpload ? (
              <ImageUpload
                onImageSelect={handleImageSelect}
                currentImage={productImage}
                maxSize={20}
                showPreviewSize={true}
                className=""
              />
            ) : (
              <div>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleChange('image', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://exemple.com/image.jpg"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Aperçu"
                      className="w-32 h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {product ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
