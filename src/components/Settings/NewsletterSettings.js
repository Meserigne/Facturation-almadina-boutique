import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../UI/ToastManager';
import communicationService from '../../services/communicationService';
import {
  ChatBubbleLeftRightIcon,
  DevicePhoneMobileIcon,
  PaperAirplaneIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import Button from '../UI/Button';
import FormField from '../UI/FormField';

const NewsletterSettings = () => {
  const { clients } = useApp();
  const { showSuccess, showError, showInfo } = useToast();
  
  const [activeTab, setActiveTab] = useState('compose');
  const [isSending, setIsSending] = useState(false);
  
  // États pour la composition de message
  const [messageData, setMessageData] = useState({
    subject: '',
    message: '',
    template: 'custom',
    channels: ['sms'],
    targetAudience: 'all'
  });

  // États pour les paramètres
  const [settings, setSettings] = useState(
    communicationService.getSettings()
  );

  const messageTemplates = [
    { value: 'welcome', label: 'Message de bienvenue' },
    { value: 'newArrival', label: 'Nouvelles arrivées' },
    { value: 'promotion', label: 'Promotion spéciale' },
    { value: 'ramadan', label: 'Collection Ramadan' },
    { value: 'eid', label: 'Collection Aïd' },
    { value: 'reminder', label: 'Rappel commande' },
    { value: 'thankYou', label: 'Remerciement' },
    { value: 'custom', label: 'Message personnalisé' }
  ];

  const audienceOptions = [
    { value: 'all', label: 'Tous les clients' },
    { value: 'recent', label: 'Clients récents (30 jours)' },
    { value: 'active', label: 'Clients actifs' },
    { value: 'vip', label: 'Clients VIP' }
  ];

  // Filtrer les clients selon l'audience sélectionnée
  const getTargetClients = () => {
    switch (messageData.targetAudience) {
      case 'recent':
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return clients.filter(client => 
          new Date(client.createdAt || client.date || 0) > thirtyDaysAgo
        );
      case 'active':
        // Clients avec au moins une commande
        return clients.filter(client => client.totalOrders > 0);
      case 'vip':
        // Clients avec plus de 5 commandes ou total > 100000 FCFA
        return clients.filter(client => 
          client.totalOrders > 5 || client.totalSpent > 100000
        );
      default:
        return clients;
    }
  };

  const targetClients = getTargetClients();
  const stats = communicationService.getCommunicationStats();

  // Gérer le changement de template
  const handleTemplateChange = (template) => {
    setMessageData(prev => ({
      ...prev,
      template,
      message: template !== 'custom' ? 
        communicationService.createMessageTemplate(template, {
          productName: 'notre nouvelle collection',
          discount: '20%',
          category: 'abayas et hijabs'
        }) : ''
    }));
  };

  // Envoyer la newsletter
  const handleSendNewsletter = async () => {
    if (!messageData.message.trim()) {
      showError('Veuillez saisir un message');
      return;
    }

    if (targetClients.length === 0) {
      showError('Aucun client sélectionné');
      return;
    }

    setIsSending(true);
    try {
      const result = await communicationService.sendNewsletter(
        targetClients,
        messageData.subject,
        messageData.message,
        messageData.channels
      );

      showSuccess(`Newsletter envoyée ! ${result.sent}/${result.total} messages réussis`);
      
      if (result.failed > 0) {
        showInfo(`${result.failed} envois ont échoué`);
      }

      // Réinitialiser le formulaire
      setMessageData({
        subject: '',
        message: '',
        template: 'custom',
        channels: ['sms'],
        targetAudience: 'all'
      });
    } catch (error) {
      showError('Erreur lors de l\'envoi de la newsletter');
    } finally {
      setIsSending(false);
    }
  };

  // Sauvegarder les paramètres
  const handleSaveSettings = () => {
    communicationService.configureSettings(settings);
    showSuccess('Paramètres sauvegardés');
  };

  const tabs = [
    { id: 'compose', label: 'Composer', icon: PaperAirplaneIcon },
    { id: 'history', label: 'Historique', icon: ChartBarIcon },
    { id: 'settings', label: 'Configuration', icon: Cog6ToothIcon }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <ChatBubbleLeftRightIcon className="h-6 w-6 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Newsletter & Communication</h2>
          <p className="text-gray-400">Communiquez avec vos clients via SMS et WhatsApp</p>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2">
            <UsersIcon className="h-5 w-5 text-emerald-400" />
            <span className="text-gray-400 text-sm">Clients total</span>
          </div>
          <div className="text-2xl font-bold text-white">{clients.length}</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2">
            <PaperAirplaneIcon className="h-5 w-5 text-blue-400" />
            <span className="text-gray-400 text-sm">Messages envoyés</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalMessages}</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2">
            <DevicePhoneMobileIcon className="h-5 w-5 text-green-400" />
            <span className="text-gray-400 text-sm">Taux de succès</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.successRate.toFixed(1)}%</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2">
            <ChartBarIcon className="h-5 w-5 text-yellow-400" />
            <span className="text-gray-400 text-sm">Coût total</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalCost} FCFA</div>
        </div>
      </div>

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
      {activeTab === 'compose' && (
        <div className="space-y-6">
          {/* Sélection du template */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Template de message</h3>
            
            <FormField
              label="Choisir un template"
              type="select"
              value={messageData.template}
              onChange={(e) => handleTemplateChange(e.target.value)}
              options={messageTemplates}
            />
          </div>

          {/* Composition du message */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Composer le message</h3>
            
            <div className="space-y-4">
              <FormField
                label="Sujet (optionnel)"
                value={messageData.subject}
                onChange={(e) => setMessageData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Ex: Nouvelles arrivées Al Madinah"
              />
              
              <FormField
                label="Message"
                type="textarea"
                value={messageData.message}
                onChange={(e) => setMessageData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Votre message ici..."
                required
              />
              
              <div className="text-sm text-gray-400">
                Caractères: {messageData.message.length}/160 
                {messageData.message.length > 160 && (
                  <span className="text-yellow-400 ml-2">
                    (SMS multiple: {Math.ceil(messageData.message.length / 160)} SMS)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sélection de l'audience et des canaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Audience */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Audience cible</h3>
              
              <FormField
                label="Sélectionner l'audience"
                type="select"
                value={messageData.targetAudience}
                onChange={(e) => setMessageData(prev => ({ ...prev, targetAudience: e.target.value }))}
                options={audienceOptions}
              />
              
              <div className="mt-3 text-sm text-gray-400">
                {targetClients.length} client{targetClients.length > 1 ? 's' : ''} sélectionné{targetClients.length > 1 ? 's' : ''}
              </div>
            </div>

            {/* Canaux */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Canaux d'envoi</h3>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={messageData.channels.includes('sms')}
                    onChange={(e) => {
                      const channels = e.target.checked
                        ? [...messageData.channels, 'sms']
                        : messageData.channels.filter(c => c !== 'sms');
                      setMessageData(prev => ({ ...prev, channels }));
                    }}
                    className="rounded border-gray-600 text-emerald-600 focus:ring-emerald-500"
                  />
                  <DevicePhoneMobileIcon className="h-5 w-5 text-blue-400" />
                  <span className="text-white">SMS (25 FCFA/message)</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={messageData.channels.includes('whatsapp')}
                    onChange={(e) => {
                      const channels = e.target.checked
                        ? [...messageData.channels, 'whatsapp']
                        : messageData.channels.filter(c => c !== 'whatsapp');
                      setMessageData(prev => ({ ...prev, channels }));
                    }}
                    className="rounded border-gray-600 text-emerald-600 focus:ring-emerald-500"
                  />
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-400" />
                  <span className="text-white">WhatsApp (Gratuit)</span>
                </label>
              </div>
              
              {messageData.channels.length === 0 && (
                <div className="mt-3 text-sm text-red-400">
                  Sélectionnez au moins un canal d'envoi
                </div>
              )}
            </div>
          </div>

          {/* Aperçu et envoi */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Aperçu et envoi</h3>
            
            <div className="space-y-4">
              {/* Coût estimé */}
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Coût estimé:</span>
                  <span className="text-emerald-400 font-semibold">
                    {messageData.channels.includes('sms') ? 
                      (targetClients.length * Math.ceil(messageData.message.length / 160) * 25) : 0
                    } FCFA
                  </span>
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {targetClients.length} destinataire{targetClients.length > 1 ? 's' : ''} × {messageData.channels.length} canal{messageData.channels.length > 1 ? 'aux' : ''}
                </div>
              </div>
              
              {/* Bouton d'envoi */}
              <Button
                onClick={handleSendNewsletter}
                loading={isSending}
                disabled={!messageData.message.trim() || messageData.channels.length === 0 || targetClients.length === 0}
                variant="primary"
                icon={PaperAirplaneIcon}
                className="w-full"
              >
                {isSending ? 'Envoi en cours...' : `Envoyer à ${targetClients.length} client${targetClients.length > 1 ? 's' : ''}`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Historique des campagnes */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Historique des campagnes</h3>
            
            <div className="space-y-4">
              {communicationService.getCampaignHistory(10).map((campaign) => (
                <div key={campaign.id} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-medium">{campaign.subject || 'Sans sujet'}</h4>
                    <span className="text-sm text-gray-400">
                      {new Date(campaign.timestamp).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{campaign.message.substring(0, 100)}...</p>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex space-x-4">
                      <span className="text-emerald-400">{campaign.results.sent} envoyés</span>
                      <span className="text-red-400">{campaign.results.failed} échoués</span>
                    </div>
                    <div className="flex space-x-2">
                      {campaign.channels.map((channel) => (
                        <span key={channel} className="px-2 py-1 bg-gray-700 rounded text-xs">
                          {channel.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Configuration SMS */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Configuration SMS</h3>
            
            <div className="space-y-4">
              <FormField
                label="Fournisseur SMS"
                type="select"
                value={settings.smsProvider || 'orange'}
                onChange={(e) => setSettings(prev => ({ ...prev, smsProvider: e.target.value }))}
                options={[
                  { value: 'orange', label: 'Orange CI' },
                  { value: 'mtn', label: 'MTN CI' },
                  { value: 'moov', label: 'Moov CI' }
                ]}
              />
              
              <FormField
                label="Nom d'expéditeur par défaut"
                value={settings.defaultSender || 'Al Madinah'}
                onChange={(e) => setSettings(prev => ({ ...prev, defaultSender: e.target.value }))}
                placeholder="Al Madinah"
              />
            </div>
          </div>

          {/* Configuration WhatsApp */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Configuration WhatsApp</h3>
            
            <div className="space-y-4">
              <FormField
                label="Fournisseur WhatsApp"
                type="select"
                value={settings.whatsappProvider || 'whatsapp-business'}
                onChange={(e) => setSettings(prev => ({ ...prev, whatsappProvider: e.target.value }))}
                options={[
                  { value: 'whatsapp-business', label: 'WhatsApp Business API' },
                  { value: 'twilio', label: 'Twilio WhatsApp' }
                ]}
              />
            </div>
          </div>

          {/* Bouton de sauvegarde */}
          <Button
            onClick={handleSaveSettings}
            variant="primary"
          >
            Sauvegarder les paramètres
          </Button>
        </div>
      )}
    </div>
  );
};

export default NewsletterSettings;
