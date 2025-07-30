class BackupService {
  constructor() {
    this.backupVersion = '1.0.0';
    this.backupKey = 'alamadinah_backup';
  }

  // Créer une sauvegarde complète des données
  createBackup(data) {
    const backup = {
      version: this.backupVersion,
      timestamp: new Date().toISOString(),
      appName: 'Al Madinah Boutique',
      data: {
        products: data.products || [],
        clients: data.clients || [],
        invoices: data.invoices || [],
        settings: data.settings || {},
        categories: data.categories || [],
        suppliers: data.suppliers || []
      },
      metadata: {
        totalProducts: data.products?.length || 0,
        totalClients: data.clients?.length || 0,
        totalInvoices: data.invoices?.length || 0,
        backupSize: this.calculateBackupSize(data)
      }
    };

    return backup;
  }

  // Exporter la sauvegarde vers un fichier
  exportBackup(data, filename = null) {
    try {
      const backup = this.createBackup(data);
      const timestamp = new Date().toISOString().split('T')[0];
      const exportFilename = filename || `alamadinah_backup_${timestamp}.json`;
      
      const backupContent = JSON.stringify(backup, null, 2);
      this.downloadFile(backupContent, exportFilename, 'application/json');
      
      return {
        success: true,
        filename: exportFilename,
        size: backupContent.length,
        message: 'Sauvegarde exportée avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de l\'export de sauvegarde:', error);
      return {
        success: false,
        error: error.message,
        message: 'Erreur lors de l\'export de la sauvegarde'
      };
    }
  }

  // Sauvegarder automatiquement dans le localStorage
  autoSave(data) {
    try {
      const backup = this.createBackup(data);
      localStorage.setItem(this.backupKey, JSON.stringify(backup));
      localStorage.setItem(`${this.backupKey}_timestamp`, backup.timestamp);
      
      return {
        success: true,
        timestamp: backup.timestamp,
        message: 'Sauvegarde automatique réussie'
      };
    } catch (error) {
      console.error('Erreur lors de la sauvegarde automatique:', error);
      return {
        success: false,
        error: error.message,
        message: 'Erreur lors de la sauvegarde automatique'
      };
    }
  }

  // Restaurer depuis un fichier
  async restoreFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const backupData = JSON.parse(event.target.result);
          const validation = this.validateBackup(backupData);
          
          if (!validation.isValid) {
            reject(new Error(validation.error));
            return;
          }
          
          resolve({
            success: true,
            data: backupData.data,
            metadata: backupData.metadata,
            version: backupData.version,
            timestamp: backupData.timestamp,
            message: 'Restauration réussie depuis le fichier'
          });
        } catch (error) {
          reject(new Error('Fichier de sauvegarde invalide'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Erreur lors de la lecture du fichier'));
      };
      
      reader.readAsText(file);
    });
  }

  // Restaurer depuis le localStorage
  restoreFromLocal() {
    try {
      const backupData = localStorage.getItem(this.backupKey);
      if (!backupData) {
        return {
          success: false,
          message: 'Aucune sauvegarde locale trouvée'
        };
      }
      
      const backup = JSON.parse(backupData);
      const validation = this.validateBackup(backup);
      
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error,
          message: 'Sauvegarde locale corrompue'
        };
      }
      
      return {
        success: true,
        data: backup.data,
        metadata: backup.metadata,
        version: backup.version,
        timestamp: backup.timestamp,
        message: 'Restauration réussie depuis la sauvegarde locale'
      };
    } catch (error) {
      console.error('Erreur lors de la restauration locale:', error);
      return {
        success: false,
        error: error.message,
        message: 'Erreur lors de la restauration locale'
      };
    }
  }

  // Valider une sauvegarde
  validateBackup(backup) {
    if (!backup || typeof backup !== 'object') {
      return { isValid: false, error: 'Format de sauvegarde invalide' };
    }
    
    if (!backup.version || !backup.timestamp || !backup.data) {
      return { isValid: false, error: 'Sauvegarde incomplète' };
    }
    
    if (!backup.data.products || !Array.isArray(backup.data.products)) {
      return { isValid: false, error: 'Données produits invalides' };
    }
    
    if (!backup.data.clients || !Array.isArray(backup.data.clients)) {
      return { isValid: false, error: 'Données clients invalides' };
    }
    
    if (!backup.data.invoices || !Array.isArray(backup.data.invoices)) {
      return { isValid: false, error: 'Données factures invalides' };
    }
    
    return { isValid: true };
  }

  // Obtenir les informations de la dernière sauvegarde
  getLastBackupInfo() {
    try {
      const timestamp = localStorage.getItem(`${this.backupKey}_timestamp`);
      const backup = localStorage.getItem(this.backupKey);
      
      if (!timestamp || !backup) {
        return null;
      }
      
      const backupData = JSON.parse(backup);
      return {
        timestamp,
        version: backupData.version,
        metadata: backupData.metadata,
        size: backup.length
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des infos de sauvegarde:', error);
      return null;
    }
  }

  // Calculer la taille de la sauvegarde
  calculateBackupSize(data) {
    try {
      return JSON.stringify(data).length;
    } catch (error) {
      return 0;
    }
  }

  // Télécharger un fichier
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Programmer une sauvegarde automatique
  scheduleAutoBackup(data, intervalMinutes = 30) {
    return setInterval(() => {
      this.autoSave(data);
    }, intervalMinutes * 60 * 1000);
  }

  // Nettoyer les anciennes sauvegardes
  cleanupOldBackups() {
    try {
      // Nettoyer les sauvegardes de plus de 30 jours
      const keys = Object.keys(localStorage);
      const backupKeys = keys.filter(key => key.startsWith('alamadinah_backup_'));
      
      backupKeys.forEach(key => {
        try {
          const data = localStorage.getItem(key);
          const backup = JSON.parse(data);
          const backupDate = new Date(backup.timestamp);
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          
          if (backupDate < thirtyDaysAgo) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          // Supprimer les sauvegardes corrompues
          localStorage.removeItem(key);
        }
      });
      
      return { success: true, message: 'Nettoyage des anciennes sauvegardes terminé' };
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new BackupService();
