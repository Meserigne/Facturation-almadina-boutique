import React from 'react';
import Barcode from 'react-barcode';

const BarcodeComponent = ({ 
  value, 
  format = 'CODE128', 
  width = 2, 
  height = 100, 
  displayValue = true,
  fontSize = 14,
  margin = 10,
  className = ''
}) => {
  if (!value) {
    return (
      <div className={`flex items-center justify-center p-4 bg-gray-100 rounded ${className}`}>
        <span className="text-gray-500">Aucune valeur pour le code-barres</span>
      </div>
    );
  }

  try {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <Barcode
          value={value}
          format={format}
          width={width}
          height={height}
          displayValue={displayValue}
          fontSize={fontSize}
          margin={margin}
          background="#ffffff"
          lineColor="#000000"
        />
      </div>
    );
  } catch (error) {
    return (
      <div className={`flex items-center justify-center p-4 bg-red-100 rounded ${className}`}>
        <span className="text-red-500">Erreur lors de la génération du code-barres</span>
      </div>
    );
  }
};

export default BarcodeComponent;
