import React from 'react';
import { ExclamationTriangleIcon, InformationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const ConfirmDialog = ({ 
  title, 
  message, 
  confirmText = 'Confirmer', 
  cancelText = 'Annuler', 
  onConfirm, 
  onCancel, 
  type = 'warning' 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <ExclamationTriangleIcon className="w-6 h-6 text-danger-600" />;
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-success-600" />;
      case 'info':
        return <InformationCircleIcon className="w-6 h-6 text-primary-600" />;
      default:
        return <ExclamationTriangleIcon className="w-6 h-6 text-warning-600" />;
    }
  };

  const getButtonColors = () => {
    switch (type) {
      case 'danger':
        return 'bg-danger-600 hover:bg-danger-700 focus:ring-danger-500';
      case 'success':
        return 'bg-success-600 hover:bg-success-700 focus:ring-success-500';
      case 'info':
        return 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500';
      default:
        return 'bg-warning-600 hover:bg-warning-700 focus:ring-warning-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-scale-in">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            {getIcon()}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonColors()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
