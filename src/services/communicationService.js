class CommunicationService {
  constructor() {
    this.smsProvider = 'orange'; // Orange CI par défaut
    this.whatsappProvider = 'whatsapp-business';
    this.apiEndpoints = {
      sms: {
        orange: 'https://api.orange.com/smsmessaging/v1/outbound',
        mtn: 'https://api.mtn.ci/sms/v1/send',
        moov: 'https://api.moov.ci/sms/send'
      },
      whatsapp: {
        'whatsapp-business': 'https://graph.facebook.com/v18.0',
        'twilio': 'https://api.twilio.com/2010-04-01'
      }
    };
  }

  // Envoyer un SMS
  async sendSMS(phoneNumber, message, options = {}) {
    try {
      // Valider le numéro de téléphone ivoirien
      const validatedNumber = this.validateIvorianPhoneNumber(phoneNumber);
      if (!validatedNumber.isValid) {
        throw new Error(validatedNumber.error);
      }

      const smsData = {
        to: validatedNumber.formatted,
        message: message,
        sender: options.sender || 'Al Madinah',
        timestamp: new Date().toISOString(),
        provider: this.smsProvider
      };

      // Simulation d'envoi SMS (en production, utiliser l'API réelle)
      const response = await this.simulateSMSAPI(smsData);
      
      // Enregistrer dans l'historique
      this.saveMessageHistory('sms', smsData, response);

      return {
        success: true,
        messageId: response.messageId,
        cost: response.cost,
        provider: this.smsProvider,
        message: 'SMS envoyé avec succès'
      };
    } catch (error) {
      console.error('Erreur envoi SMS:', error);
      return {
        success: false,
        error: error.message,
        message: 'Erreur lors de l\'envoi du SMS'
      };
    }
  }

  // Envoyer un message WhatsApp
  async sendWhatsApp(phoneNumber, message, options = {}) {
    try {
      const validatedNumber = this.validateIvorianPhoneNumber(phoneNumber);
      if (!validatedNumber.isValid) {
        throw new Error(validatedNumber.error);
      }

      const whatsappData = {
        to: validatedNumber.formatted,
        message: message,
        type: options.type || 'text',
        template: options.template || null,
        timestamp: new Date().toISOString(),
        provider: this.whatsappProvider
      };

      // Simulation d'envoi WhatsApp
      const response = await this.simulateWhatsAppAPI(whatsappData);
      
      // Enregistrer dans l'historique
      this.saveMessageHistory('whatsapp', whatsappData, response);

      return {
        success: true,
        messageId: response.messageId,
        status: response.status,
        provider: this.whatsappProvider,
        message: 'Message WhatsApp envoyé avec succès'
      };
    } catch (error) {
      console.error('Erreur envoi WhatsApp:', error);
      return {
        success: false,
        error: error.message,
        message: 'Erreur lors de l\'envoi WhatsApp'
      };
    }
  }

  // Envoyer une newsletter à plusieurs clients
  async sendNewsletter(clientList, subject, message, channels = ['sms']) {
    const results = {
      total: clientList.length,
      sent: 0,
      failed: 0,
      details: []
    };

    for (const client of clientList) {
      try {
        const clientResult = {
          clientId: client.id,
          name: client.name,
          phone: client.phone,
          channels: {}
        };

        // Envoyer via SMS si demandé
        if (channels.includes('sms') && client.phone) {
          const smsResult = await this.sendSMS(client.phone, message, {
            sender: 'Al Madinah'
          });
          clientResult.channels.sms = smsResult;
        }

        // Envoyer via WhatsApp si demandé
        if (channels.includes('whatsapp') && client.phone) {
          const whatsappResult = await this.sendWhatsApp(client.phone, message);
          clientResult.channels.whatsapp = whatsappResult;
        }

        // Vérifier si au moins un canal a réussi
        const hasSuccess = Object.values(clientResult.channels).some(r => r.success);
        if (hasSuccess) {
          results.sent++;
        } else {
          results.failed++;
        }

        results.details.push(clientResult);

        // Délai entre les envois pour éviter le spam
        await this.delay(500);
      } catch (error) {
        results.failed++;
        results.details.push({
          clientId: client.id,
          name: client.name,
          phone: client.phone,
          error: error.message
        });
      }
    }

    // Enregistrer la campagne
    this.saveCampaignHistory(subject, message, channels, results);

    return results;
  }

  // Valider un numéro de téléphone ivoirien
  validateIvorianPhoneNumber(phoneNumber) {
    // Nettoyer le numéro
    const cleaned = phoneNumber.replace(/\s+/g, '').replace(/[-()]/g, '');
    
    // Formats acceptés pour la Côte d'Ivoire
    const patterns = [
      /^(\+225|225)?([0-9]{8})$/, // Format international ou local
      /^(0[1-9][0-9]{6})$/, // Format local avec 0
    ];

    for (const pattern of patterns) {
      const match = cleaned.match(pattern);
      if (match) {
        let formatted = match[2] || match[1];
        if (formatted.startsWith('0')) {
          formatted = formatted.substring(1);
        }
        
        return {
          isValid: true,
          formatted: `+225${formatted}`,
          original: phoneNumber
        };
      }
    }

    return {
      isValid: false,
      error: 'Numéro de téléphone ivoirien invalide',
      original: phoneNumber
    };
  }

  // Créer un template de message
  createMessageTemplate(type, variables = {}) {
    const templates = {
      welcome: `Bienvenue chez Al Madinah Boutique ! 🌟 Découvrez notre collection de mode islamique élégante. ${variables.promoCode ? `Code promo: ${variables.promoCode}` : ''}`,
      
      newArrival: `🆕 Nouvelles arrivées chez Al Madinah ! ${variables.productName || 'Nouveaux produits'} maintenant disponibles. Visitez-nous pour découvrir notre collection.`,
      
      promotion: `🎉 Promotion spéciale Al Madinah ! ${variables.discount || '20%'} de réduction sur ${variables.category || 'toute la collection'}. Offre limitée !`,
      
      reminder: `📋 Rappel: Votre commande ${variables.orderId || ''} vous attend chez Al Madinah Boutique. Merci de passer la récupérer.`,
      
      thankYou: `🙏 Merci pour votre achat chez Al Madinah ! Nous espérons que vous êtes satisfait(e) de votre ${variables.productName || 'achat'}.`,
      
      ramadan: `🌙 Ramadan Kareem ! Découvrez notre collection spéciale Ramadan chez Al Madinah. Abayas, hijabs et accessoires pour ce mois béni.`,
      
      eid: `🎊 Eid Mubarak ! Célébrez l'Aïd avec style grâce à notre collection festive Al Madinah. Offres spéciales en cours !`
    };

    return templates[type] || variables.customMessage || '';
  }

  // Simuler l'API SMS (à remplacer par l'API réelle)
  async simulateSMSAPI(smsData) {
    // Simulation d'un délai d'API
    await this.delay(1000);
    
    return {
      messageId: `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'sent',
      cost: 25, // 25 FCFA par SMS
      provider: smsData.provider,
      timestamp: new Date().toISOString()
    };
  }

  // Simuler l'API WhatsApp
  async simulateWhatsAppAPI(whatsappData) {
    await this.delay(800);
    
    return {
      messageId: `wa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'delivered',
      provider: whatsappData.provider,
      timestamp: new Date().toISOString()
    };
  }

  // Enregistrer l'historique des messages
  saveMessageHistory(type, messageData, response) {
    const history = JSON.parse(localStorage.getItem('message_history') || '[]');
    
    const record = {
      id: response.messageId,
      type,
      to: messageData.to,
      message: messageData.message,
      status: response.status || 'sent',
      cost: response.cost || 0,
      timestamp: messageData.timestamp,
      provider: messageData.provider
    };
    
    history.unshift(record);
    
    // Garder seulement les 1000 derniers messages
    if (history.length > 1000) {
      history.splice(1000);
    }
    
    localStorage.setItem('message_history', JSON.stringify(history));
  }

  // Enregistrer l'historique des campagnes
  saveCampaignHistory(subject, message, channels, results) {
    const campaigns = JSON.parse(localStorage.getItem('campaign_history') || '[]');
    
    const campaign = {
      id: `campaign_${Date.now()}`,
      subject,
      message,
      channels,
      results,
      timestamp: new Date().toISOString()
    };
    
    campaigns.unshift(campaign);
    
    // Garder seulement les 100 dernières campagnes
    if (campaigns.length > 100) {
      campaigns.splice(100);
    }
    
    localStorage.setItem('campaign_history', JSON.stringify(campaigns));
  }

  // Obtenir l'historique des messages
  getMessageHistory(limit = 50) {
    const history = JSON.parse(localStorage.getItem('message_history') || '[]');
    return history.slice(0, limit);
  }

  // Obtenir l'historique des campagnes
  getCampaignHistory(limit = 20) {
    const campaigns = JSON.parse(localStorage.getItem('campaign_history') || '[]');
    return campaigns.slice(0, limit);
  }

  // Obtenir les statistiques de communication
  getCommunicationStats() {
    const messages = this.getMessageHistory(1000);
    const campaigns = this.getCampaignHistory(100);
    
    const stats = {
      totalMessages: messages.length,
      totalCampaigns: campaigns.length,
      smsCount: messages.filter(m => m.type === 'sms').length,
      whatsappCount: messages.filter(m => m.type === 'whatsapp').length,
      totalCost: messages.reduce((sum, m) => sum + (m.cost || 0), 0),
      successRate: messages.length > 0 ? 
        (messages.filter(m => m.status === 'sent' || m.status === 'delivered').length / messages.length * 100) : 0
    };
    
    return stats;
  }

  // Délai utilitaire
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Configurer les paramètres de communication
  configureSettings(settings) {
    localStorage.setItem('communication_settings', JSON.stringify({
      smsProvider: settings.smsProvider || this.smsProvider,
      whatsappProvider: settings.whatsappProvider || this.whatsappProvider,
      defaultSender: settings.defaultSender || 'Al Madinah',
      apiKeys: settings.apiKeys || {},
      autoResponse: settings.autoResponse || false,
      timestamp: new Date().toISOString()
    }));
  }

  // Obtenir les paramètres de communication
  getSettings() {
    return JSON.parse(localStorage.getItem('communication_settings') || '{}');
  }
}

export default new CommunicationService();
