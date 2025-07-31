import React, { useState, useRef } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useToast } from './ToastManager';

const ImageUpload = ({ 
  onImageSelect, 
  currentImage = null, 
  maxSize = 20, // MB - Augmenté à 20MB
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'],
  className = '',
  showPreviewSize = true,
  allowMultiple = false
}) => {
  const [preview, setPreview] = useState(currentImage);
  const [isDragging, setIsDragging] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const { showError, showSuccess } = useToast();

  // Fonction pour formater la taille du fichier
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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

    setIsProcessing(true);
    
    // Stocker les informations du fichier
    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      setPreview(imageUrl);
      setIsProcessing(false);
      onImageSelect(imageUrl, file);
      showSuccess(`Image "${file.name}" ajoutée avec succès (${formatFileSize(file.size)})`);
    };
    
    reader.onerror = () => {
      setIsProcessing(false);
      showError('Erreur lors du chargement de l\'image');
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
          <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={preview}
              alt="Aperçu du produit"
              className="w-full h-full object-cover"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-sm">Traitement en cours...</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Informations du fichier */}
          {fileInfo && showPreviewSize && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md border">
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>
                  <span className="font-medium">Nom:</span> {fileInfo.name}
                </div>
                <div>
                  <span className="font-medium">Taille:</span> {formatFileSize(fileInfo.size)}
                </div>
                <div>
                  <span className="font-medium">Type:</span> {fileInfo.type}
                </div>
                <div>
                  <span className="font-medium">Modifié:</span> {new Date(fileInfo.lastModified).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
          )}
          
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              type="button"
              onClick={handleRemoveImage}
              className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
              title="Supprimer l'image"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          
          <button
            type="button"
            onClick={openFileDialog}
            className="absolute bottom-2 right-2 px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors shadow-lg"
          >
            📁 Changer l'image
          </button>
        </div>
      ) : (
        // Zone d'upload
        <div
          className={`w-full h-64 border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer relative ${
            isDragging
              ? 'border-primary-500 bg-primary-50 scale-105'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
                <p className="text-sm font-medium text-primary-600">Traitement en cours...</p>
              </>
            ) : (
              <>
                <div className="mb-4 p-3 bg-gray-100 rounded-full">
                  <PhotoIcon className="w-12 h-12 text-primary-500" />
                </div>
                <p className="text-lg font-medium mb-2 text-gray-700">
                  📁 Sélectionner une image
                </p>
                <p className="text-sm text-gray-500 mb-4 text-center">
                  Cliquez ici ou glissez-déposez votre image
                </p>
                <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Formats supportés:</span> JPEG, PNG, WebP, GIF, BMP
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Taille maximum:</span> {maxSize}MB
                  </p>
                </div>
              </>
            )}
          </div>
          
          {isDragging && (
            <div className="absolute inset-0 bg-primary-100 bg-opacity-75 rounded-lg flex items-center justify-center">
              <div className="text-primary-600 text-center">
                <PhotoIcon className="w-16 h-16 mx-auto mb-2" />
                <p className="text-lg font-medium">Déposez votre image ici</p>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div className="text-xs text-gray-500 space-y-1">
        <p>
          <span className="font-medium">Formats supportés:</span> JPEG, PNG, WebP, GIF, BMP
        </p>
        <p>
          <span className="font-medium">Taille maximum:</span> {maxSize}MB (augmentée pour de meilleures images)
        </p>
        <p className="text-green-600">
          ✨ Sélection locale uniquement - aucune URL requise
        </p>
      </div>
    </div>
  );
};

export default ImageUpload;
