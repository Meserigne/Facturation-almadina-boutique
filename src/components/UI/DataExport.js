import React, { useState } from 'react';
import {
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  TableCellsIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useToast } from './ToastManager';

const DataExport = ({ data, filename, type = 'all' }) => {
  const [isExporting, setIsExporting] = useState(false);
  const { showSuccess, showError } = useToast();

  const exportToCSV = (data, filename) => {
    try {
      if (!data || data.length === 0) {
        showError('Aucune donnée à exporter');
        return;
      }

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            // Échapper les virgules et guillemets
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || '';
          }).join(',')
        )
      ].join('\n');

      downloadFile(csvContent, `${filename}.csv`, 'text/csv');
      showSuccess(`Export CSV réussi: ${filename}.csv`);
    } catch (error) {
      showError('Erreur lors de l\'export CSV');
      console.error('Export CSV error:', error);
    }
  };

  const exportToJSON = (data, filename) => {
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      downloadFile(jsonContent, `${filename}.json`, 'application/json');
      showSuccess(`Export JSON réussi: ${filename}.json`);
    } catch (error) {
      showError('Erreur lors de l\'export JSON');
      console.error('Export JSON error:', error);
    }
  };

  const exportToPDF = async (data, filename) => {
    try {
      // Simulation d'export PDF (nécessiterait une bibliothèque comme jsPDF)
      showError('Export PDF non implémenté - utilisez CSV ou JSON');
    } catch (error) {
      showError('Erreur lors de l\'export PDF');
      console.error('Export PDF error:', error);
    }
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async (format) => {
    setIsExporting(true);
    
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const exportFilename = `${filename}_${timestamp}`;

      switch (format) {
        case 'csv':
          exportToCSV(data, exportFilename);
          break;
        case 'json':
          exportToJSON(data, exportFilename);
          break;
        case 'pdf':
          await exportToPDF(data, exportFilename);
          break;
        default:
          showError('Format d\'export non supporté');
      }
    } catch (error) {
      showError('Erreur lors de l\'export');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const ExportButton = ({ format, icon: Icon, label, description }) => (
    <button
      onClick={() => handleExport(format)}
      disabled={isExporting || !data || data.length === 0}
      className="flex items-center space-x-3 p-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gold-500 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      <div className="p-2 bg-gold-500/10 rounded-lg group-hover:bg-gold-500/20 transition-colors">
        <Icon className="h-5 w-5 text-gold-400" />
      </div>
      <div className="flex-1 text-left">
        <div className="text-white font-medium">{label}</div>
        <div className="text-gray-400 text-sm">{description}</div>
      </div>
      <ArrowDownTrayIcon className="h-5 w-5 text-gray-400 group-hover:text-gold-400 transition-colors" />
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <DocumentArrowDownIcon className="h-6 w-6 text-gold-400" />
        <h3 className="text-lg font-semibold text-white">Exporter les données</h3>
      </div>

      {(!data || data.length === 0) && (
        <div className="text-center py-8 text-gray-400">
          <DocumentTextIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Aucune donnée disponible pour l'export</p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ExportButton
            format="csv"
            icon={TableCellsIcon}
            label="Export CSV"
            description="Compatible Excel/Sheets"
          />
          
          <ExportButton
            format="json"
            icon={DocumentTextIcon}
            label="Export JSON"
            description="Format développeur"
          />
          
          <ExportButton
            format="pdf"
            icon={DocumentArrowDownIcon}
            label="Export PDF"
            description="Document imprimable"
          />
        </div>
      )}

      {data && data.length > 0 && (
        <div className="text-sm text-gray-400 bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <p className="flex items-center space-x-2">
            <span className="font-medium text-gold-400">{data.length}</span>
            <span>élément{data.length > 1 ? 's' : ''} prêt{data.length > 1 ? 's' : ''} à exporter</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default DataExport;
