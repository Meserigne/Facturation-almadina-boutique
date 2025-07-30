import React, { useState, useEffect } from 'react';
import { useToast } from '../UI/ToastManager';
import securityService from '../../services/securityService';
import {
  ShieldCheckIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  LockClosedIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import Button from '../UI/Button';
import FormField from '../UI/FormField';

const SecuritySettings = () => {
  const { showSuccess, showError, showInfo } = useToast();
  
  const [activeTab, setActiveTab] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // États pour le changement de mot de passe
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // États pour l'audit de sécurité
  const [auditResult, setAuditResult] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);
  
  // États pour les paramètres de sécurité
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    requireStrongPassword: true,
    enableTwoFactor: false,
    autoLogout: true,
    encryptData: true
  });

  useEffect(() => {
    // Charger les paramètres de sécurité existants
    loadSecuritySettings();
    // Effectuer un audit initial
    performInitialAudit();
  }, []);

  const loadSecuritySettings = () => {
    const saved = securityService.secureRetrieve('security_settings');
    if (saved) {
      setSecuritySettings(prev => ({ ...prev, ...saved }));
    }
  };

  const performInitialAudit = () => {
    const audit = securityService.performSecurityAudit();
    setAuditResult(audit);
  };

  // Valider la force du mot de passe en temps réel
  const passwordStrength = securityService.validatePasswordStrength(passwordData.newPassword);

  // Changer le mot de passe
  const handlePasswordChange = () => {
    if (!passwordData.currentPassword) {
      showError('Veuillez saisir votre mot de passe actuel');
      return;
    }

    if (!passwordData.newPassword) {
      showError('Veuillez saisir un nouveau mot de passe');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!passwordStrength.isValid) {
      showError('Le mot de passe ne respecte pas les critères de sécurité');
      return;
    }

    // Simuler la vérification du mot de passe actuel
    // En production, ceci serait vérifié côté serveur
    const currentPasswordHash = securityService.secureRetrieve('user_password');
    
    try {
      // Hasher le nouveau mot de passe
      const hashedPassword = securityService.hashPassword(passwordData.newPassword);
      
      // Sauvegarder le nouveau mot de passe
      securityService.secureStore('user_password', hashedPassword);
      
      // Enregistrer l'événement de sécurité
      securityService.recordLoginAttempt('admin', true);
      
      showSuccess('Mot de passe modifié avec succès');
      
      // Réinitialiser le formulaire
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      showError('Erreur lors du changement de mot de passe');
    }
  };

  // Effectuer un audit de sécurité
  const handleSecurityAudit = async () => {
    setIsAuditing(true);
    try {
      // Simuler un délai d'audit
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const audit = securityService.performSecurityAudit();
      setAuditResult(audit);
      
      showSuccess('Audit de sécurité terminé');
    } catch (error) {
      showError('Erreur lors de l\'audit de sécurité');
    } finally {
      setIsAuditing(false);
    }
  };

  // Sauvegarder les paramètres de sécurité
  const handleSaveSecuritySettings = () => {
    try {
      securityService.secureStore('security_settings', securitySettings);
      showSuccess('Paramètres de sécurité sauvegardés');
    } catch (error) {
      showError('Erreur lors de la sauvegarde');
    }
  };

  // Nettoyer les données de sécurité
  const handleSecurityCleanup = () => {
    try {
      securityService.secureCleanup();
      showSuccess('Nettoyage de sécurité effectué');
      performInitialAudit();
    } catch (error) {
      showError('Erreur lors du nettoyage');
    }
  };

  // Générer un code de vérification
  const handleGenerateVerificationCode = () => {
    const code = securityService.generateVerificationCode();
    showInfo(`Code de vérification généré: ${code}`);
  };

  const tabs = [
    { id: 'password', label: 'Mot de passe', icon: KeyIcon },
    { id: 'settings', label: 'Paramètres', icon: LockClosedIcon },
    { id: 'audit', label: 'Audit', icon: ShieldCheckIcon }
  ];

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'fort': return 'text-emerald-400';
      case 'moyen': return 'text-yellow-400';
      case 'faible': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStrengthWidth = (score) => {
    return `${(score / 5) * 100}%`;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <ShieldCheckIcon className="h-6 w-6 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Sécurité</h2>
          <p className="text-gray-400">Protégez votre application et vos données</p>
        </div>
      </div>

      {/* Alerte de sécurité si nécessaire */}
      {auditResult && auditResult.recommendations.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-medium">Recommandations de sécurité</p>
              <ul className="text-yellow-300 text-sm mt-1 space-y-1">
                {auditResult.recommendations.map((rec, index) => (
                  <li key={index}>• {rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Onglets */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'password' && (
        <div className="space-y-6">
          {/* Changement de mot de passe */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <KeyIcon className="h-5 w-5 text-emerald-400 mr-2" />
              Changer le mot de passe
            </h3>
            
            <div className="space-y-4">
              <div className="relative">
                <FormField
                  label="Mot de passe actuel"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              
              <div className="relative">
                <FormField
                  label="Nouveau mot de passe"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-300"
                >
                  {showNewPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Indicateur de force du mot de passe */}
              {passwordData.newPassword && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Force du mot de passe:</span>
                    <span className={`text-sm font-medium ${getStrengthColor(passwordStrength.strength)}`}>
                      {passwordStrength.strength.charAt(0).toUpperCase() + passwordStrength.strength.slice(1)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.strength === 'fort' ? 'bg-emerald-500' :
                        passwordStrength.strength === 'moyen' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: getStrengthWidth(passwordStrength.score) }}
                    ></div>
                  </div>
                  
                  {/* Critères de mot de passe */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(passwordStrength.requirements).map(([key, met]) => (
                      <div key={key} className={`flex items-center space-x-1 ${met ? 'text-emerald-400' : 'text-gray-400'}`}>
                        <CheckCircleIcon className="h-3 w-3" />
                        <span>
                          {key === 'minLength' && '8+ caractères'}
                          {key === 'hasUpperCase' && 'Majuscule'}
                          {key === 'hasLowerCase' && 'Minuscule'}
                          {key === 'hasNumbers' && 'Chiffre'}
                          {key === 'hasSpecialChar' && 'Caractère spécial'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <FormField
                label="Confirmer le nouveau mot de passe"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />
              
              <Button
                onClick={handlePasswordChange}
                variant="primary"
                disabled={!passwordStrength.isValid || passwordData.newPassword !== passwordData.confirmPassword}
              >
                Changer le mot de passe
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Paramètres de session */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Paramètres de session</h3>
            
            <div className="space-y-4">
              <FormField
                label="Délai d'expiration de session (minutes)"
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                min="5"
                max="120"
              />
              
              <FormField
                label="Tentatives de connexion maximales"
                type="number"
                value={securitySettings.maxLoginAttempts}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
                min="3"
                max="10"
              />
            </div>
          </div>

          {/* Options de sécurité */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Options de sécurité</h3>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-white font-medium">Mot de passe fort requis</span>
                  <p className="text-sm text-gray-400">Exiger des mots de passe complexes</p>
                </div>
                <input
                  type="checkbox"
                  checked={securitySettings.requireStrongPassword}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, requireStrongPassword: e.target.checked }))}
                  className="rounded border-gray-600 text-emerald-600 focus:ring-emerald-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-white font-medium">Déconnexion automatique</span>
                  <p className="text-sm text-gray-400">Se déconnecter automatiquement après inactivité</p>
                </div>
                <input
                  type="checkbox"
                  checked={securitySettings.autoLogout}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, autoLogout: e.target.checked }))}
                  className="rounded border-gray-600 text-emerald-600 focus:ring-emerald-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-white font-medium">Chiffrement des données</span>
                  <p className="text-sm text-gray-400">Chiffrer les données sensibles</p>
                </div>
                <input
                  type="checkbox"
                  checked={securitySettings.encryptData}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, encryptData: e.target.checked }))}
                  className="rounded border-gray-600 text-emerald-600 focus:ring-emerald-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-white font-medium">Authentification à deux facteurs</span>
                  <p className="text-sm text-gray-400">Sécurité supplémentaire avec code SMS</p>
                </div>
                <input
                  type="checkbox"
                  checked={securitySettings.enableTwoFactor}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, enableTwoFactor: e.target.checked }))}
                  className="rounded border-gray-600 text-emerald-600 focus:ring-emerald-500"
                />
              </label>
            </div>
          </div>

          {/* Actions de sécurité */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Actions de sécurité</h3>
            
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleSaveSecuritySettings}
                variant="primary"
              >
                Sauvegarder les paramètres
              </Button>
              
              <Button
                onClick={handleGenerateVerificationCode}
                variant="secondary"
              >
                Générer code de vérification
              </Button>
              
              <Button
                onClick={handleSecurityCleanup}
                variant="outline"
              >
                Nettoyer les données de sécurité
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="space-y-6">
          {/* Audit de sécurité */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Audit de sécurité</h3>
              <Button
                onClick={handleSecurityAudit}
                loading={isAuditing}
                variant="primary"
                icon={ShieldCheckIcon}
              >
                {isAuditing ? 'Audit en cours...' : 'Lancer un audit'}
              </Button>
            </div>
            
            {auditResult && (
              <div className="space-y-4">
                <div className="text-sm text-gray-400">
                  Dernier audit: {new Date(auditResult.timestamp).toLocaleString('fr-FR')}
                </div>
                
                {/* Résultats des vérifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(auditResult.checks).map(([check, passed]) => (
                    <div key={check} className={`flex items-center space-x-2 p-3 rounded-lg ${
                      passed ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'
                    }`}>
                      {passed ? (
                        <CheckCircleIcon className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                      )}
                      <span className={passed ? 'text-emerald-400' : 'text-red-400'}>
                        {check === 'sessionValid' && 'Session valide'}
                        {check === 'passwordPolicy' && 'Politique de mot de passe'}
                        {check === 'dataEncryption' && 'Chiffrement des données'}
                        {check === 'backupSecurity' && 'Sécurité des sauvegardes'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuritySettings;
