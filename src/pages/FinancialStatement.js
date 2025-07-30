import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const FinancialStatement = () => {
  const { invoices, products } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Calcul des données financières
  const calculateFinancialData = () => {
    const now = new Date();
    let startDate, endDate;

    if (selectedPeriod === 'month') {
      startDate = new Date(selectedYear, selectedMonth - 1, 1);
      endDate = new Date(selectedYear, selectedMonth, 0);
    } else if (selectedPeriod === 'quarter') {
      const quarter = Math.ceil(selectedMonth / 3);
      startDate = new Date(selectedYear, (quarter - 1) * 3, 1);
      endDate = new Date(selectedYear, quarter * 3, 0);
    } else {
      startDate = new Date(selectedYear, 0, 1);
      endDate = new Date(selectedYear, 11, 31);
    }

    const filteredInvoices = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.date);
      return invoiceDate >= startDate && invoiceDate <= endDate;
    });

    // Revenus
    const totalRevenue = filteredInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const paidRevenue = filteredInvoices
      .filter(invoice => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + invoice.total, 0);
    const pendingRevenue = filteredInvoices
      .filter(invoice => invoice.status === 'pending')
      .reduce((sum, invoice) => sum + invoice.total, 0);

    // Coûts (estimation basée sur les prix d'achat des produits)
    const totalCosts = filteredInvoices.reduce((sum, invoice) => {
      const invoiceCost = invoice.items.reduce((itemSum, item) => {
        const product = products.find(p => p.id === item.productId);
        const costPrice = product ? (product.price * 0.6) : 0; // Estimation 60% du prix de vente
        return itemSum + (costPrice * item.quantity);
      }, 0);
      return sum + invoiceCost;
    }, 0);

    // Bénéfices
    const grossProfit = paidRevenue - totalCosts;
    const netProfit = grossProfit * 0.85; // Estimation après charges (15%)

    // Inventaire
    const inventoryValue = products.reduce((sum, product) => 
      sum + (product.price * product.stock), 0);

    return {
      revenue: {
        total: totalRevenue,
        paid: paidRevenue,
        pending: pendingRevenue
      },
      costs: totalCosts,
      profit: {
        gross: grossProfit,
        net: netProfit,
        margin: paidRevenue > 0 ? (grossProfit / paidRevenue * 100) : 0
      },
      inventory: inventoryValue,
      invoiceCount: filteredInvoices.length,
      paidInvoiceCount: filteredInvoices.filter(i => i.status === 'paid').length
    };
  };

  const financialData = calculateFinancialData();

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "emerald" }) => (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-emerald-200/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-500/10 border border-${color}-500/20`}>
          <Icon className={`h-6 w-6 text-${color}-400`} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend === 'up' ? (
              <ArrowTrendingUpIcon className="h-4 w-4" />
            ) : (
              <ArrowTrendingDownIcon className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">{trendValue}%</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-300 text-sm font-medium mb-2">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <ChartBarIcon className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Bilan Comptable</h1>
              <p className="text-gray-400">Analyse financière détaillée</p>
            </div>
          </div>

          {/* Filtres de période */}
          <div className="flex flex-wrap gap-4 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-emerald-400" />
              <span className="text-gray-300 font-medium">Période:</span>
            </div>
            
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="month">Mensuel</option>
              <option value="quarter">Trimestriel</option>
              <option value="year">Annuel</option>
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              {[2024, 2023, 2022].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            {selectedPeriod === 'month' && (
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleDateString('fr-FR', { month: 'long' })}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Cartes de statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Chiffre d'Affaires Total"
            value={`${financialData.revenue.total.toLocaleString()} FCFA`}
            icon={CurrencyDollarIcon}
            color="gold"
          />
          <StatCard
            title="Revenus Encaissés"
            value={`${financialData.revenue.paid.toLocaleString()} FCFA`}
            icon={ArrowTrendingUpIcon}
            color="emerald"
          />
          <StatCard
            title="Bénéfice Net"
            value={`${financialData.profit.net.toLocaleString()} FCFA`}
            icon={ChartBarIcon}
            trend={financialData.profit.net > 0 ? 'up' : 'down'}
            trendValue={financialData.profit.margin.toFixed(1)}
            color="gold"
          />
          <StatCard
            title="Valeur Stock"
            value={`${financialData.inventory.toLocaleString()} FCFA`}
            icon={DocumentTextIcon}
            color="blue"
          />
        </div>

        {/* Détails financiers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Compte de résultat */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gold-200/20">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <DocumentTextIcon className="h-6 w-6 text-emerald-400 mr-2" />
              Compte de Résultat
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-gray-300">Chiffre d'Affaires</span>
                <span className="text-white font-semibold">
                  {financialData.revenue.total.toLocaleString()} FCFA
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-gray-300 ml-4">• Encaissé</span>
                <span className="text-emerald-400 font-semibold">
                  {financialData.revenue.paid.toLocaleString()} FCFA
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-gray-300 ml-4">• En attente</span>
                <span className="text-yellow-400 font-semibold">
                  {financialData.revenue.pending.toLocaleString()} FCFA
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-gray-300">Coût des Marchandises</span>
                <span className="text-red-400 font-semibold">
                  -{financialData.costs.toLocaleString()} FCFA
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-gray-300 font-semibold">Bénéfice Brut</span>
                <span className="text-gold-400 font-bold">
                  {financialData.profit.gross.toLocaleString()} FCFA
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-gray-300">Charges Estimées (15%)</span>
                <span className="text-red-400 font-semibold">
                  -{(financialData.profit.gross * 0.15).toLocaleString()} FCFA
                </span>
              </div>
              
              <div className="flex justify-between items-center py-4 bg-emerald-500/10 rounded-lg px-4">
                <span className="text-white font-bold text-lg">Bénéfice Net</span>
                <span className="text-emerald-400 font-bold text-lg">
                  {financialData.profit.net.toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </div>

          {/* Indicateurs de performance */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gold-200/20">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <ChartBarIcon className="h-6 w-6 text-emerald-400 mr-2" />
              Indicateurs de Performance
            </h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Marge Bénéficiaire</span>
                  <span className="text-emerald-400 font-bold">
                    {financialData.profit.margin.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(financialData.profit.margin, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Taux d'Encaissement</span>
                  <span className="text-emerald-400 font-bold">
                    {((financialData.revenue.paid / financialData.revenue.total) * 100 || 0).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(financialData.revenue.paid / financialData.revenue.total) * 100 || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {financialData.invoiceCount}
                  </div>
                  <div className="text-gray-400 text-sm">Factures Total</div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">
                    {financialData.paidInvoiceCount}
                  </div>
                  <div className="text-gray-400 text-sm">Factures Payées</div>
                </div>
              </div>
              
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                <h3 className="text-blue-400 font-semibold mb-2">Rotation des Stocks</h3>
                <div className="text-white">
                  Valeur: {financialData.inventory.toLocaleString()} FCFA
                </div>
                <div className="text-gray-400 text-sm mt-1">
                  {products.length} produits en stock
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialStatement;
