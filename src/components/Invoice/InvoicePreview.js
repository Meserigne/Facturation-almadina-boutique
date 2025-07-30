import React from 'react';
import { useApp } from '../../context/AppContext';
import BarcodeComponent from '../UI/Barcode';
import { XMarkIcon, DocumentArrowDownIcon, PrinterIcon } from '@heroicons/react/24/outline';

const InvoicePreview = ({ invoice, onClose }) => {
  const { settings } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // TODO: Implement PDF generation
    alert('Fonctionnalité de téléchargement PDF à venir');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 no-print">
          <h3 className="text-lg font-semibold text-gray-900">
            Aperçu de la facture {invoice.number}
          </h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <PrinterIcon className="w-4 h-4 mr-2" />
              Imprimer
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
            >
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              Télécharger PDF
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Invoice content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="max-w-3xl mx-auto bg-white">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {settings.businessInfo.name}
                </h1>
                <div className="text-gray-600 space-y-1">
                  <p>{settings.businessInfo.address}</p>
                  <p>{settings.businessInfo.phone}</p>
                  <p>{settings.businessInfo.email}</p>
                  {settings.businessInfo.website && (
                    <p>{settings.businessInfo.website}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-primary-600 mb-2">FACTURE</h2>
                <div className="text-gray-600 space-y-1">
                  <p><span className="font-medium">N°:</span> {invoice.number}</p>
                  <p><span className="font-medium">Date:</span> {new Date(invoice.date).toLocaleDateString('fr-FR')}</p>
                  {settings.businessInfo.taxNumber && (
                    <p><span className="font-medium">N° TVA:</span> {settings.businessInfo.taxNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Client info */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Facturé à:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900">{invoice.client.name}</p>
                <p className="text-gray-600">{invoice.client.email}</p>
                <p className="text-gray-600">{invoice.client.phone}</p>
                <p className="text-gray-600">{invoice.client.address}</p>
              </div>
            </div>

            {/* Items table */}
            <div className="mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 font-semibold text-gray-900">Description</th>
                    <th className="text-center py-3 font-semibold text-gray-900">Qté</th>
                    <th className="text-right py-3 font-semibold text-gray-900">Prix unitaire</th>
                    <th className="text-right py-3 font-semibold text-gray-900">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                        </div>
                      </td>
                      <td className="text-center py-3 text-gray-900">{item.quantity}</td>
                      <td className="text-right py-3 text-gray-900">
                        {item.price.toLocaleString()} F CFA
                      </td>
                      <td className="text-right py-3 font-medium text-gray-900">
                        {(item.price * item.quantity).toLocaleString()} F CFA
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sous-total:</span>
                    <span className="font-medium">
                      {invoice.subtotal?.toLocaleString() || (invoice.total - (invoice.tax || 0)).toLocaleString()} F CFA
                    </span>
                  </div>
                  {settings.invoiceSettings.showTax && invoice.tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">TVA ({settings.invoiceSettings.taxRate}%):</span>
                      <span className="font-medium">{invoice.tax.toLocaleString()} F CFA</span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary-600">{invoice.total.toLocaleString()} F CFA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment info */}
            {invoice.paymentMethod && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Informations de paiement:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    Mode de paiement: <span className="font-medium">{invoice.paymentMethod}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{invoice.notes}</p>
                </div>
              </div>
            )}

            {/* Terms and conditions */}
            {settings.invoiceSettings.termsAndConditions && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Conditions générales:</h3>
                <p className="text-sm text-gray-600">{settings.invoiceSettings.termsAndConditions}</p>
              </div>
            )}

            {/* Barcode */}
            {settings.barcodeSettings?.showOnInvoices && (
              <div className="mb-8 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Code-barres de la facture:</h3>
                <div className="flex justify-center">
                  <BarcodeComponent 
                    value={`${settings.barcodeSettings?.invoicePrefix || 'INV'}-${invoice.number}`}
                    format={settings.barcodeSettings?.invoiceFormat || 'CODE128'}
                    width={2}
                    height={60}
                    fontSize={12}
                    className="bg-white p-4 rounded-lg border"
                  />
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="text-center pt-8 border-t border-gray-200">
              {settings.invoiceSettings.footerNote && (
                <p className="text-sm text-gray-600 mb-2">{settings.invoiceSettings.footerNote}</p>
              )}
              <p className="text-xs text-gray-500">
                Facture générée le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
