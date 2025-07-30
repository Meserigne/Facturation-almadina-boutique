import React, { useState, useRef } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useToast } from './ToastManager';

const ImageUpload = ({ 
  onImageSelect, 
  currentImage = null, 
  maxSize = 5, // MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = ''
}) => {
  const [preview, setPreview] = useState(currentImage);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { showError, showSuccess } = useToast();

  const validateFile = (file) => {
    // Vérifier le type de fichier
    if (!acceptedTypes.includes(file.type)) {
      showError(`Type de fichier non supporté. Utilisez: ${acceptedTypes.join(', ')}`);
      return false;
    }

    // Vérifier la taille
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      showError(`Fichier trop volumineux. Taille maximum: ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (file) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      setPreview(imageUrl);
      onImageSelect(imageUrl, file);
      showSuccess('Image ajoutée avec succès');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageSelect(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showSuccess('Image supprimée');
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Image du produit
      </label>
      
      {preview ? (
        // Aperçu de l'image
        <div className="relative">
          <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={preview}
              alt="Aperçu du produit"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={openFileDialog}
            className="absolute bottom-2 right-2 px-3 py-1 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors"
          >
            Changer
          </button>
        </div>
      ) : (
        // Zone d'upload
        <div
          className={`w-full h-48 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <PhotoIcon className="w-12 h-12 mb-4" />
            <p className="text-sm font-medium mb-2">
              Cliquez ou glissez une image ici
            </p>
            <p className="text-xs text-gray-400">
              PNG, JPG, WEBP jusqu'à {maxSize}MB
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
      />
      
      <p className="text-xs text-gray-500">
        Formats supportés: JPEG, PNG, WebP • Taille maximum: {maxSize}MB
      </p>
    </div>
  );
};

export default ImageUpload;
