import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';

const Reports = () => {
  const { products, clients, invoices, settings } = useApp();
  const [dateRange, setDateRange] = useState('last30days');
  const [reportType, setReportType] = useState('overview');

  // Filter data based on date range
  const getFilteredInvoices = () => {
    const now = new Date();
    let startDate = new Date();

    switch (dateRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'last7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'last30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case 'last3months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'last6months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'lastyear':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    return invoices.filter(invoice => new Date(invoice.date) >= startDate);
  };

  const filteredInvoices = getFilteredInvoices();

  // Calculate metrics
  const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalInvoices = filteredInvoices.length;
  const averageInvoiceValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;
  const paidInvoices = filteredInvoices.filter(inv => inv.status === 'paid');
  const pendingRevenue = filteredInvoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.total, 0);

  // Top products
  const productSales = {};
  filteredInvoices.forEach(invoice => {
    invoice.items.forEach(item => {
      if (productSales[item.id]) {
        productSales[item.id].quantity += item.quantity;
        productSales[item.id].revenue += item.price * item.quantity;
      } else {
        productSales[item.id] = {
          name: item.name,
          quantity: item.quantity,
          revenue: item.price * item.quantity
        };
      }
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Top clients
  const clientSales = {};
  filteredInvoices.forEach(invoice => {
    if (clientSales[invoice.client.id]) {
      clientSales[invoice.client.id].total += invoice.total;
      clientSales[invoice.client.id].invoices += 1;
    } else {
      clientSales[invoice.client.id] = {
        name: invoice.client.name,
        total: invoice.total,
        invoices: 1
      };
    }
  });

  const topClients = Object.values(clientSales)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Monthly revenue data
  const monthlyData = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = date.toISOString().slice(0, 7);
    const monthName = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
    
    const monthlyRevenue = invoices
      .filter(invoice => invoice.date.startsWith(monthKey))
      .reduce((sum, invoice) => sum + invoice.total, 0);
    
    const monthlyInvoices = invoices
      .filter(invoice => invoice.date.startsWith(monthKey)).length;
    
    monthlyData.push({
      month: monthName,
      revenue: monthlyRevenue,
      invoices: monthlyInvoices
    });
  }

  // Category sales data
  const categorySales = {};
  filteredInvoices.forEach(invoice => {
    invoice.items.forEach(item => {
      if (categorySales[item.category]) {
        categorySales[item.category] += item.price * item.quantity;
      } else {
        categorySales[item.category] = item.price * item.quantity;
      }
    });
  });

  const categoryData = Object.entries(categorySales).map(([category, revenue]) => ({
    name: category,
    value: revenue
  }));

  const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  const exportReport = () => {
    const reportData = {
      period: dateRange,
      generatedAt: new Date().toISOString(),
      summary: {
        totalRevenue,
        totalInvoices,
        averageInvoiceValue,
        pendingRevenue
      },
      topProducts,
      topClients,
      monthlyData,
      categoryData
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapport-${dateRange}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapports et statistiques</h1>
          <p className="mt-1 text-sm text-gray-600">
            Analysez les performances de votre boutique
          </p>
        </div>
        <div className="mt-3 sm:mt-0 flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="today">Aujourd'hui</option>
            <option value="last7days">7 derniers jours</option>
            <option value="last30days">30 derniers jours</option>
            <option value="last3months">3 derniers mois</option>
            <option value="last6months">6 derniers mois</option>
            <option value="lastyear">Dernière année</option>
          </select>
          <button
            onClick={exportReport}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="flex items-center">
            <div className="bg-success-100 rounded-lg p-3">
              <CurrencyDollarIcon className="w-6 h-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chiffre d'affaires</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalRevenue.toLocaleString()} F CFA
              </p>
              <div className="flex items-center text-sm text-success-600">
                <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                <span>+12% vs période précédente</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="flex items-center">
            <div className="bg-primary-100 rounded-lg p-3">
              <ChartBarIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Nombre de factures</p>
              <p className="text-2xl font-semibold text-gray-900">{totalInvoices}</p>
              <div className="flex items-center text-sm text-success-600">
                <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                <span>+8% vs période précédente</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="flex items-center">
            <div className="bg-warning-100 rounded-lg p-3">
              <CalendarIcon className="w-6 h-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Panier moyen</p>
              <p className="text-2xl font-semibold text-gray-900">
                {averageInvoiceValue.toLocaleString()} F CFA
              </p>
              <div className="flex items-center text-sm text-danger-600">
                <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                <span>-3% vs période précédente</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-semibold text-gray-900">
                {pendingRevenue.toLocaleString()} F CFA
              </p>
              <p className="text-sm text-gray-500">
                {filteredInvoices.filter(inv => inv.status === 'pending').length} facture(s)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue trend */}
        <div className="bg-white rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Évolution du chiffre d'affaires
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toLocaleString()} F CFA`, 'Chiffre d\'affaires']} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#0ea5e9" 
                  fill="#0ea5e9"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category distribution */}
        <div className="bg-white rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ventes par catégorie
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value.toLocaleString()} F CFA`, 'Ventes']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top products */}
        <div className="bg-white rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Produits les plus vendus
          </h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.quantity} vendus</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-success-600">
                    {product.revenue.toLocaleString()} F CFA
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top clients */}
        <div className="bg-white rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Meilleurs clients
          </h3>
          <div className="space-y-4">
            {topClients.map((client, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                    <span className="text-success-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-600">{client.invoices} facture(s)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-success-600">
                    {client.total.toLocaleString()} F CFA
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed analytics */}
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Analyse détaillée
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">{products.length}</p>
            <p className="text-sm text-gray-600">Produits en catalogue</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-success-600">{clients.length}</p>
            <p className="text-sm text-gray-600">Clients enregistrés</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-warning-600">
              {products.filter(p => p.stock <= p.minStock).length}
            </p>
            <p className="text-sm text-gray-600">Produits en stock faible</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
