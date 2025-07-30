import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BuildingOfficeIcon,
  DocumentTextIcon,
  BellIcon,
  PaintBrushIcon,
  GlobeAltIcon,
  CheckIcon,
  CreditCardIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  CloudArrowDownIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import BackupSettings from '../components/Settings/BackupSettings';
import SecuritySettings from '../components/Settings/SecuritySettings';
import NewsletterSettings from '../components/Settings/NewsletterSettings';

const Settings = () => {
  const { settings, actions } = useApp();
  const [activeTab, setActiveTab] = useState('business');
  const [formData, setFormData] = useState(settings);
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'business', name: 'Entreprise', icon: BuildingOfficeIcon },
    { id: 'invoice', name: 'Facturation', icon: DocumentTextIcon },
    { id: 'payment', name: 'Paiements', icon: CreditCardIcon },
    { id: 'barcode', name: 'Code-barres', icon: QrCodeIcon },
    { id: 'backup', name: 'Sauvegarde', icon: CloudArrowDownIcon },
    { id: 'security', name: 'Sécurité', icon: ShieldCheckIcon },
    { id: 'newsletter', name: 'Newsletter', icon: ChatBubbleLeftRightIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'appearance', name: 'Apparence', icon: PaintBrushIcon },
  ];

  const handleSave = () => {
    actions.updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
          <p className="mt-1 text-sm text-gray-600">
            Configurez votre application selon vos besoins
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
            saved 
              ? 'bg-success-600 hover:bg-success-700' 
              : 'bg-primary-600 hover:bg-primary-700'
          }`}
        >
          {saved ? (
            <>
              <CheckIcon className="w-4 h-4 mr-2" />
              Sauvegardé
            </>
          ) : (
            'Sauvegarder'
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-3" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-soft p-6">
            {/* Business Settings */}
            {activeTab === 'business' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Informations de l'entreprise
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom de l'entreprise
                      </label>
                      <input
                        type="text"
                        value={formData.businessInfo.name}
                        onChange={(e) => handleChange('businessInfo', 'name', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={formData.businessInfo.phone}
                        onChange={(e) => handleChange('businessInfo', 'phone', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.businessInfo.email}
                        onChange={(e) => handleChange('businessInfo', 'email', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site web
                      </label>
                      <input
                        type="url"
                        value={formData.businessInfo.website}
                        onChange={(e) => handleChange('businessInfo', 'website', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse
                      </label>
                      <textarea
                        rows={3}
                        value={formData.businessInfo.address}
                        onChange={(e) => handleChange('businessInfo', 'address', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Numéro de TVA
                      </label>
                      <input
                        type="text"
                        value={formData.businessInfo.taxNumber}
                        onChange={(e) => handleChange('businessInfo', 'taxNumber', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Devise
                      </label>
                      <select
                        value={formData.businessInfo.currency}
                        onChange={(e) => handleChange('businessInfo', 'currency', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="F CFA">F CFA</option>
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Invoice Settings */}
            {activeTab === 'invoice' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Paramètres de facturation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Préfixe des factures
                      </label>
                      <input
                        type="text"
                        value={formData.invoiceSettings.prefix}
                        onChange={(e) => handleChange('invoiceSettings', 'prefix', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Numéro de départ
                      </label>
                      <input
                        type="number"
                        value={formData.invoiceSettings.startNumber}
                        onChange={(e) => handleChange('invoiceSettings', 'startNumber', parseInt(e.target.value))}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Taux de TVA (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.invoiceSettings.taxRate}
                        onChange={(e) => handleChange('invoiceSettings', 'taxRate', parseFloat(e.target.value))}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showTax"
                        checked={formData.invoiceSettings.showTax}
                        onChange={(e) => handleChange('invoiceSettings', 'showTax', e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="showTax" className="ml-2 block text-sm text-gray-900">
                        Afficher la TVA sur les factures
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Conditions générales
                      </label>
                      <textarea
                        rows={3}
                        value={formData.invoiceSettings.termsAndConditions}
                        onChange={(e) => handleChange('invoiceSettings', 'termsAndConditions', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Note de pied de page
                      </label>
                      <textarea
                        rows={2}
                        value={formData.invoiceSettings.footerNote}
                        onChange={(e) => handleChange('invoiceSettings', 'footerNote', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Configuration PayDunya
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <CreditCardIcon className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-900">À propos de PayDunya</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          PayDunya est une plateforme de paiement en ligne qui permet d'accepter les paiements par Mobile Money, cartes bancaires et autres moyens de paiement en Afrique de l'Ouest.
                        </p>
                        <a href="https://paydunya.com" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 underline mt-2 inline-block">
                          Créer un compte PayDunya →
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mode
                      </label>
                      <select
                        value={formData.paymentSettings?.mode || 'test'}
                        onChange={(e) => handleChange('paymentSettings', 'mode', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="test">Test</option>
                        <option value="live">Production</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Master Key
                      </label>
                      <input
                        type="password"
                        value={formData.paymentSettings?.masterKey || ''}
                        onChange={(e) => handleChange('paymentSettings', 'masterKey', e.target.value)}
                        placeholder="Votre Master Key PayDunya"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Private Key
                      </label>
                      <input
                        type="password"
                        value={formData.paymentSettings?.privateKey || ''}
                        onChange={(e) => handleChange('paymentSettings', 'privateKey', e.target.value)}
                        placeholder="Votre Private Key PayDunya"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Public Key
                      </label>
                      <input
                        type="text"
                        value={formData.paymentSettings?.publicKey || ''}
                        onChange={(e) => handleChange('paymentSettings', 'publicKey', e.target.value)}
                        placeholder="Votre Public Key PayDunya"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Token
                      </label>
                      <input
                        type="password"
                        value={formData.paymentSettings?.token || ''}
                        onChange={(e) => handleChange('paymentSettings', 'token', e.target.value)}
                        placeholder="Votre Token PayDunya"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enablePayments"
                        checked={formData.paymentSettings?.enabled || false}
                        onChange={(e) => handleChange('paymentSettings', 'enabled', e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="enablePayments" className="ml-2 block text-sm text-gray-900">
                        Activer les paiements en ligne
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Barcode Settings */}
            {activeTab === 'barcode' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Configuration des code-barres
                  </h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <QrCodeIcon className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-green-900">Code-barres automatiques</h4>
                        <p className="text-sm text-green-700 mt-1">
                          Les code-barres sont générés automatiquement pour vos produits et factures, facilitant la gestion et le suivi.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Format des code-barres produits
                      </label>
                      <select
                        value={formData.barcodeSettings?.productFormat || 'CODE128'}
                        onChange={(e) => handleChange('barcodeSettings', 'productFormat', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="CODE128">CODE128</option>
                        <option value="CODE39">CODE39</option>
                        <option value="EAN13">EAN13</option>
                        <option value="EAN8">EAN8</option>
                        <option value="UPC">UPC</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Format des code-barres factures
                      </label>
                      <select
                        value={formData.barcodeSettings?.invoiceFormat || 'CODE128'}
                        onChange={(e) => handleChange('barcodeSettings', 'invoiceFormat', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="CODE128">CODE128</option>
                        <option value="CODE39">CODE39</option>
                        <option value="EAN13">EAN13</option>
                        <option value="EAN8">EAN8</option>
                        <option value="UPC">UPC</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showBarcodeOnProducts"
                        checked={formData.barcodeSettings?.showOnProducts || true}
                        onChange={(e) => handleChange('barcodeSettings', 'showOnProducts', e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="showBarcodeOnProducts" className="ml-2 block text-sm text-gray-900">
                        Afficher les code-barres sur les produits
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showBarcodeOnInvoices"
                        checked={formData.barcodeSettings?.showOnInvoices || true}
                        onChange={(e) => handleChange('barcodeSettings', 'showOnInvoices', e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="showBarcodeOnInvoices" className="ml-2 block text-sm text-gray-900">
                        Afficher les code-barres sur les factures
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Préfixe code-barres produits
                      </label>
                      <input
                        type="text"
                        value={formData.barcodeSettings?.productPrefix || 'ALM'}
                        onChange={(e) => handleChange('barcodeSettings', 'productPrefix', e.target.value)}
                        placeholder="ALM"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Préfixe code-barres factures
                      </label>
                      <input
                        type="text"
                        value={formData.barcodeSettings?.invoicePrefix || 'INV'}
                        onChange={(e) => handleChange('barcodeSettings', 'invoicePrefix', e.target.value)}
                        placeholder="INV"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Préférences de notification
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Stock faible</p>
                        <p className="text-sm text-gray-600">
                          Recevoir une notification quand le stock est faible
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.notifications.lowStock}
                        onChange={(e) => handleChange('notifications', 'lowStock', e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Nouvelles commandes</p>
                        <p className="text-sm text-gray-600">
                          Recevoir une notification pour chaque nouvelle commande
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.notifications.newOrder}
                        onChange={(e) => handleChange('notifications', 'newOrder', e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Rappels de paiement</p>
                        <p className="text-sm text-gray-600">
                          Recevoir des rappels pour les factures en retard
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.notifications.paymentReminder}
                        onChange={(e) => handleChange('notifications', 'paymentReminder', e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seuil de stock minimum
                      </label>
                      <input
                        type="number"
                        value={formData.notifications.stockThreshold}
                        onChange={(e) => handleChange('notifications', 'stockThreshold', parseInt(e.target.value))}
                        className="block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <p className="mt-1 text-sm text-gray-600">
                        Nombre d'articles restants avant notification
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Backup Settings */}
            {activeTab === 'backup' && <BackupSettings />}

            {/* Security Settings */}
            {activeTab === 'security' && <SecuritySettings />}

            {/* Newsletter Settings */}
            {activeTab === 'newsletter' && <NewsletterSettings />}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Apparence et langue
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Thème
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleChange('ui', 'theme', 'light')}
                          className={`p-4 border-2 rounded-lg text-left transition-colors ${
                            formData.ui?.theme === 'light'
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="w-full h-16 bg-white border rounded mb-2"></div>
                          <p className="text-sm font-medium">Clair</p>
                        </button>
                        <button
                          onClick={() => handleChange('ui', 'theme', 'dark')}
                          className={`p-4 border-2 rounded-lg text-left transition-colors ${
                            formData.ui?.theme === 'dark'
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="w-full h-16 bg-gray-800 border rounded mb-2"></div>
                          <p className="text-sm font-medium">Sombre</p>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Langue
                      </label>
                      <select
                        value={formData.ui?.language || 'fr'}
                        onChange={(e) => handleChange('ui', 'language', e.target.value)}
                        className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="ar">العربية</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
