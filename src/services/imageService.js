import githubPagesService from './githubPagesService';

class ImageService {
  constructor() {
    this.storageKey = 'alamadinah_product_images';
    this.githubPages = githubPagesService;
    this.initStorage();
  }

  initStorage() {
    if (!this.githubPages.getItem(this.storageKey)) {
      this.githubPages.setItem(this.storageKey, JSON.stringify({}));
    }
  }

  // Sauvegarder une image pour un produit
  saveProductImage(productId, imageData, fileName) {
    try {
      const images = this.getAllImages();
      const imageId = `product_${productId}_${Date.now()}`;
      
      images[imageId] = {
        productId,
        imageData,
        fileName,
        uploadDate: new Date().toISOString(),
        size: this.calculateImageSize(imageData)
      };

      this.githubPages.setItem(this.storageKey, JSON.stringify(images));
      return imageId;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'image:', error);
      throw new Error('Impossible de sauvegarder l\'image');
    }
  }

  // Récupérer l'image d'un produit
  getProductImage(productId) {
    try {
      const images = this.getAllImages();
      const productImages = Object.values(images).filter(img => img.productId === productId);
      
      // Retourner la plus récente
      if (productImages.length > 0) {
        return productImages.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))[0];
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'image:', error);
      return null;
    }
  }

  // Supprimer l'image d'un produit
  deleteProductImage(productId) {
    try {
      const images = this.getAllImages();
      const updatedImages = {};
      
      Object.keys(images).forEach(imageId => {
        if (images[imageId].productId !== productId) {
          updatedImages[imageId] = images[imageId];
        }
      });

      localStorage.setItem(this.storageKey, JSON.stringify(updatedImages));
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
      return false;
    }
  }

  // Récupérer toutes les images
  getAllImages() {
    try {
      return JSON.parse(this.githubPages.getItem(this.storageKey)) || {};
    } catch (error) {
      console.error('Erreur lors de la lecture des images:', error);
      return {};
    }
  }

  // Calculer la taille approximative d'une image base64
  calculateImageSize(base64String) {
    if (!base64String) return 0;
    
    // Supprimer le préfixe data:image/...;base64,
    const base64Data = base64String.split(',')[1] || base64String;
    
    // Calculer la taille en bytes
    const sizeInBytes = (base64Data.length * 3) / 4;
    
    // Retourner en KB
    return Math.round(sizeInBytes / 1024);
  }

  // Obtenir les statistiques de stockage
  getStorageStats() {
    const images = this.getAllImages();
    const imageCount = Object.keys(images).length;
    const totalSize = Object.values(images).reduce((sum, img) => sum + (img.size || 0), 0);
    
    return {
      imageCount,
      totalSizeKB: totalSize,
      totalSizeMB: Math.round(totalSize / 1024 * 100) / 100
    };
  }

  // Nettoyer les images orphelines (produits supprimés)
  cleanupOrphanedImages(existingProductIds) {
    try {
      const images = this.getAllImages();
      const cleanedImages = {};
      let deletedCount = 0;

      Object.keys(images).forEach(imageId => {
        const image = images[imageId];
        if (existingProductIds.includes(image.productId)) {
          cleanedImages[imageId] = image;
        } else {
          deletedCount++;
        }
      });

      localStorage.setItem(this.storageKey, JSON.stringify(cleanedImages));
      
      return {
        deletedCount,
        remainingCount: Object.keys(cleanedImages).length
      };
    } catch (error) {
      console.error('Erreur lors du nettoyage des images:', error);
      return { deletedCount: 0, remainingCount: 0 };
    }
  }

  // Exporter toutes les images (pour sauvegarde)
  exportImages() {
    return this.getAllImages();
  }

  // Importer des images (pour restauration)
  importImages(imagesData) {
    try {
      this.githubPages.setItem(this.storageKey, JSON.stringify(imagesData));
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'importation des images:', error);
      return false;
    }
  }

  // Vider toutes les images
  clearAllImages() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify({}));
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de toutes les images:', error);
      return false;
    }
  }

  // Redimensionner une image (optionnel)
  resizeImage(imageData, maxWidth = 800, maxHeight = 600, quality = 0.8) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calculer les nouvelles dimensions
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir en base64
        const resizedImageData = canvas.toDataURL('image/jpeg', quality);
        resolve(resizedImageData);
      };
      
      img.src = imageData;
    });
  }
}

const imageService = new ImageService();
export default imageService;
