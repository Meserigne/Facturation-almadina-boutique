import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PayDunyaService from '../../services/paydunyaService';
import {
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const PayDunyaPayment = ({ invoice, onPaymentSuccess, onPaymentCancel }) => {
  const { settings } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);

  const paymentSettings = settings.paymentSettings;

  // Vérifier si PayDunya est configuré
  const isConfigured = paymentSettings?.enabled && 
                      paymentSettings?.masterKey && 
                      paymentSettings?.privateKey && 
                      paymentSettings?.publicKey && 
                      paymentSettings?.token;

  const initializePayment = async () => {
    if (!isConfigured) {
      setError('PayDunya n\'est pas configuré. Veuillez configurer vos clés API dans les paramètres.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const paydunyaService = new PayDunyaService(paymentSettings);

      const paymentData = {
        totalAmount: invoice.total,
        description: `Facture ${invoice.number} - Al Madinah Boutique`,
        invoiceId: invoice.id,
        customerId: invoice.clientId,
        orderId: invoice.number,
        storeName: settings.businessInfo?.name || 'Al Madinah Boutique',
        storePhone: settings.businessInfo?.phone || '+225 XX XX XX XX',
        storeAddress: settings.businessInfo?.address || 'Abidjan, Côte d\'Ivoire',
        returnUrl: `${window.location.origin}/payment-success?invoice=${invoice.id}`,
        cancelUrl: `${window.location.origin}/payment-cancel?invoice=${invoice.id}`,
        callbackUrl: `${window.location.origin}/payment-callback`
      };

      const result = await paydunyaService.createInvoice(paymentData);

      if (result.success) {
        // Rediriger vers la page de paiement PayDunya
        window.open(result.invoiceUrl, '_blank');
        setPaymentStatus('redirected');
      } else {
        setError(result.error || 'Erreur lors de l\'initialisation du paiement');
      }
    } catch (err) {
      setError('Erreur de connexion avec PayDunya');
      console.error('Erreur PayDunya:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const checkPaymentStatus = async (token) => {
    if (!token) return;

    try {
      const paydunyaService = new PayDunyaService(paymentSettings);
      const result = await paydunyaService.checkPaymentStatus(token);

      if (result.success) {
        if (result.status === 'completed') {
          setPaymentStatus('completed');
          onPaymentSuccess && onPaymentSuccess(invoice, result.data);
        } else {
          setPaymentStatus('pending');
        }
      }
    } catch (err) {
      console.error('Erreur lors de la vérification du statut:', err);
    }
  };

  if (!isConfigured) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <ExclamationCircleIcon className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
          <div>
            <h4 className="text-sm font-medium text-yellow-900">Configuration requise</h4>
            <p className="text-sm text-yellow-700 mt-1">
              PayDunya n'est pas configuré. Veuillez configurer vos clés API dans les paramètres pour activer les paiements en ligne.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Informations de la facture */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Détails du paiement</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Facture:</span>
            <span className="ml-2 font-medium">{invoice.number}</span>
          </div>
          <div>
            <span className="text-gray-600">Montant:</span>
            <span className="ml-2 font-medium">{invoice.total.toLocaleString()} F CFA</span>
          </div>
          <div>
            <span className="text-gray-600">Client:</span>
            <span className="ml-2 font-medium">{invoice.clientName}</span>
          </div>
          <div>
            <span className="text-gray-600">Date:</span>
            <span className="ml-2 font-medium">{new Date(invoice.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Statut du paiement */}
      {paymentStatus && (
        <div className={`rounded-lg p-4 ${
          paymentStatus === 'completed' ? 'bg-green-50 border border-green-200' :
          paymentStatus === 'redirected' ? 'bg-blue-50 border border-blue-200' :
          'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-start">
            {paymentStatus === 'completed' ? (
              <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
            ) : (
              <ArrowPathIcon className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
            )}
            <div>
              <h4 className={`text-sm font-medium ${
                paymentStatus === 'completed' ? 'text-green-900' :
                paymentStatus === 'redirected' ? 'text-blue-900' :
                'text-yellow-900'
              }`}>
                {paymentStatus === 'completed' ? 'Paiement confirmé' :
                 paymentStatus === 'redirected' ? 'Redirection vers PayDunya' :
                 'Paiement en attente'}
              </h4>
              <p className={`text-sm mt-1 ${
                paymentStatus === 'completed' ? 'text-green-700' :
                paymentStatus === 'redirected' ? 'text-blue-700' :
                'text-yellow-700'
              }`}>
                {paymentStatus === 'completed' ? 'Le paiement a été traité avec succès.' :
                 paymentStatus === 'redirected' ? 'Vous avez été redirigé vers PayDunya. Complétez le paiement dans l\'onglet ouvert.' :
                 'Le paiement est en cours de traitement.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <ExclamationCircleIcon className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-red-900">Erreur de paiement</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex space-x-3">
        <button
          onClick={initializePayment}
          disabled={isProcessing || paymentStatus === 'completed'}
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
            isProcessing || paymentStatus === 'completed'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          {isProcessing ? (
            <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <CreditCardIcon className="w-4 h-4 mr-2" />
          )}
          {isProcessing ? 'Traitement...' : 'Payer avec PayDunya'}
        </button>

        {paymentStatus !== 'completed' && (
          <button
            onClick={() => onPaymentCancel && onPaymentCancel()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
        )}
      </div>

      {/* Moyens de paiement acceptés */}
      <div className="text-xs text-gray-500 mt-4">
        <p className="font-medium mb-1">Moyens de paiement acceptés via PayDunya:</p>
        <p>• Mobile Money (Orange Money, MTN Money, Moov Money)</p>
        <p>• Cartes bancaires (Visa, MasterCard)</p>
        <p>• Virements bancaires</p>
      </div>
    </div>
  );
};

export default PayDunyaPayment;
