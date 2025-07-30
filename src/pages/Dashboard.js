import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  CubeIcon,
  UsersIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { products, clients, invoices, settings } = useApp();

  // Calculate statistics
  const totalProducts = products.length;
  const totalClients = clients.length;
  const totalInvoices = invoices.length;
  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  
  // Low stock products
  const lowStockProducts = products.filter(product => product.stock <= product.minStock);
  
  // Recent invoices (last 7 days)
  const recentInvoices = invoices.filter(invoice => {
    const invoiceDate = new Date(invoice.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return invoiceDate >= weekAgo;
  }).slice(0, 5);

  // Monthly revenue data for chart
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = date.toISOString().slice(0, 7);
    const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });
    
    const monthlyRevenue = invoices
      .filter(invoice => invoice.date.startsWith(monthKey))
      .reduce((sum, invoice) => sum + invoice.total, 0);
    
    monthlyData.push({
      month: monthName,
      revenue: monthlyRevenue
    });
  }

  // Category distribution for pie chart
  const categoryData = {};
  products.forEach(product => {
    categoryData[product.category] = (categoryData[product.category] || 0) + 1;
  });
  
  const pieData = Object.entries(categoryData).map(([category, count]) => ({
    name: category,
    value: count
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  const stats = [
    {
      name: 'Total Produits',
      value: totalProducts,
      icon: CubeIcon,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase'
    },
    {
      name: 'Total Clients',
      value: totalClients,
      icon: UsersIcon,
      color: 'bg-green-500',
      change: '+5%',
      changeType: 'increase'
    },
    {
      name: 'Factures',
      value: totalInvoices,
      icon: DocumentTextIcon,
      color: 'bg-yellow-500',
      change: '+8%',
      changeType: 'increase'
    },
    {
      name: 'Chiffre d\'affaires',
      value: `${totalRevenue.toLocaleString()} ${settings.businessInfo.currency}`,
      icon: CurrencyDollarIcon,
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'increase'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Bienvenue sur votre tableau de bord</h1>
            <p className="text-primary-100 mt-1">
              Voici un aperçu de votre activité aujourd'hui
            </p>
          </div>
          <div className="hidden md:block">
            <Link
              to="/invoices/create"
              className="bg-white text-primary-600 px-4 py-2 rounded-md font-medium hover:bg-primary-50 transition-colors flex items-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Nouvelle facture</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-soft p-6 card-hover">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <div className="flex items-center">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <div className={`ml-2 flex items-center text-sm ${
                    stat.changeType === 'increase' ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {stat.changeType === 'increase' ? (
                      <ArrowTrendingUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-4 h-4" />
                    )}
                    <span className="ml-1">{stat.change}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="bg-white rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Évolution du chiffre d'affaires
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toLocaleString()} F CFA`, 'Chiffre d\'affaires']} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#0ea5e9" 
                  strokeWidth={3}
                  dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category distribution */}
        <div className="bg-white rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Répartition des produits par catégorie
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent activity and alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent invoices */}
        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Factures récentes</h3>
            <Link 
              to="/invoices" 
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              Voir tout
            </Link>
          </div>
          <div className="space-y-3">
            {recentInvoices.length > 0 ? (
              recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{invoice.number}</p>
                    <p className="text-sm text-gray-600">{invoice.client.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success-600">
                      {invoice.total.toLocaleString()} F CFA
                    </p>
                    <p className="text-sm text-gray-500">{invoice.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Aucune facture récente</p>
            )}
          </div>
        </div>

        {/* Low stock alerts */}
        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-warning-500 mr-2" />
              Stock faible
            </h3>
            <Link 
              to="/products" 
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              Gérer stock
            </Link>
          </div>
          <div className="space-y-3">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-warning-50 rounded-lg border border-warning-200">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-warning-600">
                      {product.stock} restant{product.stock > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-gray-500">Min: {product.minStock}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-success-600 text-center py-4 flex items-center justify-center">
                <span className="mr-2">✓</span>
                Tous les produits ont un stock suffisant
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/products"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
          >
            <CubeIcon className="w-8 h-8 text-gray-400 group-hover:text-primary-600" />
            <div className="ml-3">
              <p className="font-medium text-gray-900">Ajouter un produit</p>
              <p className="text-sm text-gray-500">Gérer votre inventaire</p>
            </div>
          </Link>
          
          <Link
            to="/clients"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
          >
            <UsersIcon className="w-8 h-8 text-gray-400 group-hover:text-primary-600" />
            <div className="ml-3">
              <p className="font-medium text-gray-900">Ajouter un client</p>
              <p className="text-sm text-gray-500">Élargir votre clientèle</p>
            </div>
          </Link>
          
          <Link
            to="/invoices/create"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
          >
            <DocumentTextIcon className="w-8 h-8 text-gray-400 group-hover:text-primary-600" />
            <div className="ml-3">
              <p className="font-medium text-gray-900">Créer une facture</p>
              <p className="text-sm text-gray-500">Nouvelle transaction</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
