import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const FormField = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  required = false, 
  placeholder, 
  disabled = false,
  options = [], // For select fields
  className = '',
  icon: Icon,
  ...props 
}) => {
  const baseInputClasses = `
    block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
    bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed
  `;

  const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';

  const renderInput = () => {
    if (type === 'select') {
      return (
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${baseInputClasses} ${errorClasses} ${className}`}
          {...props}
        >
          <option value="">{placeholder || `Sélectionner ${label.toLowerCase()}`}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={4}
          className={`${baseInputClasses} ${errorClasses} ${className} resize-none`}
          {...props}
        />
      );
    }

    return (
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseInputClasses} ${errorClasses} ${className} ${Icon ? 'pl-10' : ''}`}
          {...props}
        />
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      {renderInput()}
      
      {error && (
        <div className="flex items-center space-x-2 text-red-400 text-sm">
          <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FormField;
