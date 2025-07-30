import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../UI/ToastManager';
import backupService from '../../services/backupService';
import {
  CloudArrowDownIcon,
  CloudArrowUpIcon,
  ShieldCheckIcon,
  ClockIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Button from '../UI/Button';

const BackupSettings = () => {
  const { products, clients, invoices, settings } = useApp();
  const { showSuccess, showError, showInfo } = useToast();
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(
    localStorage.getItem('auto_backup_enabled') === 'true'
  );

  const appData = { products, clients, invoices, settings };
  const lastBackupInfo = backupService.getLastBackupInfo();

  // Créer une sauvegarde manuelle
  const handleManualBackup = async () => {
    setIsBackingUp(true);
    try {
      const result = backupService.exportBackup(appData);
      if (result.success) {
        showSuccess(`Sauvegarde créée: ${result.filename}`);
        // Aussi sauvegarder localement
        backupService.autoSave(appData);
      } else {
        showError(result.message);
      }
    } catch (error) {
      showError('Erreur lors de la création de la sauvegarde');
    } finally {
      setIsBackingUp(false);
    }
  };

  // Restaurer depuis un fichier
  const handleFileRestore = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsRestoring(true);
    try {
      const result = await backupService.restoreFromFile(file);
      if (result.success) {
        showSuccess('Sauvegarde restaurée avec succès');
        showInfo('Rechargez la page pour voir les données restaurées');
        // En production, vous rechargeriez les données dans le contexte
      } else {
        showError('Erreur lors de la restauration');
      }
    } catch (error) {
      showError('Fichier de sauvegarde invalide');
    } finally {
      setIsRestoring(false);
      event.target.value = '';
    }
  };

  // Restaurer depuis la sauvegarde locale
  const handleLocalRestore = () => {
    const result = backupService.restoreFromLocal();
    if (result.success) {
      showSuccess('Données restaurées depuis la sauvegarde locale');
      showInfo('Rechargez la page pour voir les données restaurées');
    } else {
      showError(result.message);
    }
  };

  // Activer/désactiver la sauvegarde automatique
  const toggleAutoBackup = () => {
    const newState = !autoBackupEnabled;
    setAutoBackupEnabled(newState);
    localStorage.setItem('auto_backup_enabled', newState.toString());
    
    if (newState) {
      // Programmer la sauvegarde automatique toutes les 30 minutes
      const intervalId = backupService.scheduleAutoBackup(appData, 30);
      localStorage.setItem('auto_backup_interval', intervalId.toString());
      showSuccess('Sauvegarde automatique activée (toutes les 30 min)');
    } else {
      // Arrêter la sauvegarde automatique
      const intervalId = localStorage.getItem('auto_backup_interval');
      if (intervalId) {
        clearInterval(parseInt(intervalId));
        localStorage.removeItem('auto_backup_interval');
      }
      showInfo('Sauvegarde automatique désactivée');
    }
  };

  // Nettoyer les anciennes sauvegardes
  const handleCleanup = () => {
    const result = backupService.cleanupOldBackups();
    if (result.success) {
      showSuccess('Anciennes sauvegardes supprimées');
    } else {
      showError('Erreur lors du nettoyage');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <ShieldCheckIcon className="h-6 w-6 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Sauvegarde & Restauration</h2>
          <p className="text-gray-400">Protégez vos données importantes</p>
        </div>
      </div>

      {/* Informations de la dernière sauvegarde */}
      {lastBackupInfo && (
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <ClockIcon className="h-5 w-5 text-emerald-400" />
            <span className="text-white font-medium">Dernière sauvegarde</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Date:</span>
              <p className="text-white">{new Date(lastBackupInfo.timestamp).toLocaleString('fr-FR')}</p>
            </div>
            <div>
              <span className="text-gray-400">Taille:</span>
              <p className="text-white">{formatFileSize(lastBackupInfo.size)}</p>
            </div>
            <div>
              <span className="text-gray-400">Produits:</span>
              <p className="text-white">{lastBackupInfo.metadata?.totalProducts || 0}</p>
            </div>
            <div>
              <span className="text-gray-400">Factures:</span>
              <p className="text-white">{lastBackupInfo.metadata?.totalInvoices || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Sauvegarde manuelle */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <CloudArrowDownIcon className="h-5 w-5 text-emerald-400 mr-2" />
          Sauvegarde Manuelle
        </h3>
        
        <div className="space-y-4">
          <p className="text-gray-300">
            Créez une sauvegarde complète de toutes vos données (produits, clients, factures, paramètres).
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleManualBackup}
              loading={isBackingUp}
              variant="primary"
              icon={DocumentArrowDownIcon}
            >
              {isBackingUp ? 'Sauvegarde...' : 'Créer une sauvegarde'}
            </Button>
            
            <Button
              onClick={handleCleanup}
              variant="secondary"
            >
              Nettoyer anciennes sauvegardes
            </Button>
          </div>
        </div>
      </div>

      {/* Sauvegarde automatique */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <ClockIcon className="h-5 w-5 text-emerald-400 mr-2" />
          Sauvegarde Automatique
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300">Sauvegarder automatiquement toutes les 30 minutes</p>
              <p className="text-sm text-gray-400">Les sauvegardes sont stockées localement dans votre navigateur</p>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoBackupEnabled}
                onChange={toggleAutoBackup}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Restauration */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <CloudArrowUpIcon className="h-5 w-5 text-emerald-400 mr-2" />
          Restauration
        </h3>
        
        <div className="space-y-4">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-yellow-400 font-medium">Attention</p>
                <p className="text-yellow-300 text-sm">
                  La restauration remplacera toutes vos données actuelles. 
                  Assurez-vous d'avoir une sauvegarde récente avant de continuer.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Restaurer depuis un fichier */}
            <div className="space-y-3">
              <h4 className="text-white font-medium">Depuis un fichier</h4>
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileRestore}
                  className="hidden"
                  id="restore-file"
                  disabled={isRestoring}
                />
                <label
                  htmlFor="restore-file"
                  className={`inline-flex items-center px-4 py-2 border border-gray-600 rounded-lg text-white bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors ${
                    isRestoring ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                  {isRestoring ? 'Restauration...' : 'Choisir un fichier'}
                </label>
              </div>
            </div>
            
            {/* Restaurer depuis la sauvegarde locale */}
            <div className="space-y-3">
              <h4 className="text-white font-medium">Sauvegarde locale</h4>
              <Button
                onClick={handleLocalRestore}
                variant="secondary"
                disabled={!lastBackupInfo}
              >
                Restaurer la dernière sauvegarde
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Statistiques des données</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">{products.length}</div>
            <div className="text-gray-400 text-sm">Produits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">{clients.length}</div>
            <div className="text-gray-400 text-sm">Clients</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">{invoices.length}</div>
            <div className="text-gray-400 text-sm">Factures</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {formatFileSize(backupService.calculateBackupSize(appData))}
            </div>
            <div className="text-gray-400 text-sm">Taille totale</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupSettings;
