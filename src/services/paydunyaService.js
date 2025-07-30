import axios from 'axios';

class PayDunyaService {
  constructor(config = {}) {
    this.baseURL = 'https://app.paydunya.com/api/v1';
    this.masterKey = config.masterKey || '';
    this.privateKey = config.privateKey || '';
    this.publicKey = config.publicKey || '';
    this.token = config.token || '';
    this.mode = config.mode || 'test'; // 'test' or 'live'
  }

  // Configuration des headers pour les requêtes
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'PAYDUNYA-MASTER-KEY': this.masterKey,
      'PAYDUNYA-PRIVATE-KEY': this.privateKey,
      'PAYDUNYA-TOKEN': this.token
    };
  }

  // Créer une facture de paiement
  async createInvoice(invoiceData) {
    try {
      const payload = {
        invoice: {
          total_amount: invoiceData.totalAmount,
          description: invoiceData.description || 'Facture Al Madinah Boutique',
          return_url: invoiceData.returnUrl || window.location.origin + '/payment-success',
          cancel_url: invoiceData.cancelUrl || window.location.origin + '/payment-cancel',
          callback_url: invoiceData.callbackUrl || window.location.origin + '/payment-callback',
        },
        store: {
          name: invoiceData.storeName || 'Al Madinah Boutique',
          tagline: invoiceData.storeTagline || 'Mode islamique et accessoires religieux',
          phone: invoiceData.storePhone || '+225 XX XX XX XX',
          postal_address: invoiceData.storeAddress || 'Abidjan, Côte d\'Ivoire',
          website_url: invoiceData.storeWebsite || 'https://alamadinah.ci'
        },
        actions: {
          cancel_url: invoiceData.cancelUrl || window.location.origin + '/payment-cancel',
          return_url: invoiceData.returnUrl || window.location.origin + '/payment-success',
          callback_url: invoiceData.callbackUrl || window.location.origin + '/payment-callback'
        },
        custom_data: {
          invoice_id: invoiceData.invoiceId,
          customer_id: invoiceData.customerId,
          order_id: invoiceData.orderId
        }
      };

      const response = await axios.post(
        `${this.baseURL}/checkout-invoice/create`,
        payload,
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        data: response.data,
        invoiceUrl: response.data.response_text,
        token: response.data.token
      };
    } catch (error) {
      console.error('Erreur PayDunya:', error);
      return {
        success: false,
        error: error.response?.data?.response_text || error.message
      };
    }
  }

  // Vérifier le statut d'un paiement
  async checkPaymentStatus(token) {
    try {
      const response = await axios.get(
        `${this.baseURL}/checkout-invoice/confirm/${token}`,
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        status: response.data.response_code === '00' ? 'completed' : 'pending',
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.response_text || error.message
      };
    }
  }

  // Obtenir la liste des paiements
  async getPayments(page = 1, limit = 50) {
    try {
      const response = await axios.get(
        `${this.baseURL}/checkout-invoice/list?page=${page}&limit=${limit}`,
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.response_text || error.message
      };
    }
  }

  // Valider la configuration
  validateConfig() {
    const requiredFields = ['masterKey', 'privateKey', 'publicKey', 'token'];
    const missing = requiredFields.filter(field => !this[field]);
    
    return {
      isValid: missing.length === 0,
      missingFields: missing
    };
  }

  // Tester la connexion
  async testConnection() {
    try {
      const testInvoice = {
        totalAmount: 100,
        description: 'Test de connexion PayDunya',
        invoiceId: 'TEST-' + Date.now()
      };

      const result = await this.createInvoice(testInvoice);
      return result.success;
    } catch (error) {
      return false;
    }
  }
}

export default PayDunyaService;
