/**
 * Service de compatibilité GitHub Pages
 * Gère les limitations spécifiques à GitHub Pages
 */

class GitHubPagesService {
  constructor() {
    this.isGitHubPages = this.detectGitHubPages();
    this.storageAvailable = this.checkStorageAvailability();
  }

  // Détecter si l'app s'exécute sur GitHub Pages
  detectGitHubPages() {
    const hostname = window.location.hostname;
    return hostname.includes('github.io') || hostname.includes('githubusercontent.com');
  }

  // Vérifier la disponibilité du localStorage
  checkStorageAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage non disponible:', e);
      return false;
    }
  }

  // Stockage sécurisé avec fallback
  setItem(key, value) {
    try {
      if (this.storageAvailable) {
        localStorage.setItem(key, value);
        return true;
      } else {
        // Fallback: utiliser sessionStorage ou mémoire
        sessionStorage.setItem(key, value);
        console.warn(`Fallback vers sessionStorage pour: ${key}`);
        return true;
      }
    } catch (error) {
      console.error(`Erreur de stockage pour ${key}:`, error);
      // Dernier recours: stockage en mémoire (perdu au refresh)
      this.memoryStorage = this.memoryStorage || {};
      this.memoryStorage[key] = value;
      return false;
    }
  }

  // Récupération sécurisée avec fallback
  getItem(key) {
    try {
      if (this.storageAvailable) {
        return localStorage.getItem(key);
      } else {
        // Essayer sessionStorage puis mémoire
        const sessionValue = sessionStorage.getItem(key);
        if (sessionValue) return sessionValue;
        
        return this.memoryStorage?.[key] || null;
      }
    } catch (error) {
      console.error(`Erreur de récupération pour ${key}:`, error);
      return null;
    }
  }

  // Suppression sécurisée
  removeItem(key) {
    try {
      if (this.storageAvailable) {
        localStorage.removeItem(key);
      }
      sessionStorage.removeItem(key);
      if (this.memoryStorage) {
        delete this.memoryStorage[key];
      }
    } catch (error) {
      console.error(`Erreur de suppression pour ${key}:`, error);
    }
  }

  // Vérifier les limitations d'images sur GitHub Pages
  checkImageUploadLimitations() {
    if (!this.isGitHubPages) return { limited: false };

    // GitHub Pages a des limitations sur la taille des fichiers
    const maxSize = 25 * 1024 * 1024; // 25MB max pour GitHub Pages
    const warnings = [];

    if (this.isGitHubPages) {
      warnings.push('GitHub Pages: Stockage d\'images limité au navigateur');
      warnings.push('Les images seront perdues si vous videz le cache');
    }

    return {
      limited: true,
      maxSize,
      warnings,
      recommendations: [
        'Utilisez Netlify pour un stockage plus fiable',
        'Sauvegardez régulièrement vos données',
        'Considérez un service d\'images externe pour la production'
      ]
    };
  }

  // Optimiser les images pour GitHub Pages
  optimizeImageForGitHubPages(imageData, maxSize = 20 * 1024 * 1024) {
    return new Promise((resolve, reject) => {
      try {
        // Vérifier la taille
        const sizeInBytes = imageData.length * 0.75; // Approximation base64
        
        if (sizeInBytes <= maxSize) {
          resolve(imageData);
          return;
        }

        // Créer un canvas pour redimensionner
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculer les nouvelles dimensions
          const ratio = Math.sqrt(maxSize / sizeInBytes);
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;
          
          // Redimensionner
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Convertir en base64 avec qualité réduite
          const optimizedData = canvas.toDataURL('image/jpeg', 0.8);
          resolve(optimizedData);
        };
        
        img.onerror = () => reject(new Error('Erreur de chargement de l\'image'));
        img.src = imageData;
        
      } catch (error) {
        reject(error);
      }
    });
  }

  // Diagnostic des problèmes GitHub Pages
  diagnoseIssues() {
    const issues = [];
    const warnings = [];
    const info = [];

    // Vérifier l'environnement
    if (this.isGitHubPages) {
      info.push('✓ Application détectée sur GitHub Pages');
      
      if (!this.storageAvailable) {
        issues.push('✗ localStorage non disponible');
        warnings.push('Les données ne seront pas persistantes');
      } else {
        info.push('✓ localStorage disponible');
      }

      // Vérifier la configuration du routing
      const hasRouterFallback = document.querySelector('script[data-spa-router]');
      if (!hasRouterFallback) {
        warnings.push('Script de routing SPA détecté dans index.html');
      }

    } else {
      info.push('Application en cours d\'exécution en local ou sur autre plateforme');
    }

    return {
      isGitHubPages: this.isGitHubPages,
      storageAvailable: this.storageAvailable,
      issues,
      warnings,
      info
    };
  }

  // Afficher les informations de diagnostic
  showDiagnostic() {
    const diagnostic = this.diagnoseIssues();
    
    console.group('🔍 Diagnostic GitHub Pages');
    
    diagnostic.info.forEach(item => console.info(item));
    diagnostic.warnings.forEach(item => console.warn(item));
    diagnostic.issues.forEach(item => console.error(item));
    
    if (diagnostic.isGitHubPages) {
      const imageCheck = this.checkImageUploadLimitations();
      console.group('📷 Limitations d\'images');
      imageCheck.warnings?.forEach(warning => console.warn(warning));
      imageCheck.recommendations?.forEach(rec => console.info('💡', rec));
      console.groupEnd();
    }
    
    console.groupEnd();
    
    return diagnostic;
  }
}

// Instance singleton
const githubPagesService = new GitHubPagesService();

export default githubPagesService;
