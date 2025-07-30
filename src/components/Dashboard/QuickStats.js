import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  DocumentTextIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline';

const QuickStats = () => {
  const { invoices, products, clients } = useContext(AppContext);

  // Calculs des statistiques
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Revenus du mois
  const monthlyRevenue = invoices
    .filter(invoice => {
      const invoiceDate = new Date(invoice.date);
      return invoiceDate.getMonth() === currentMonth && 
             invoiceDate.getFullYear() === currentYear &&
             invoice.status === 'paid';
    })
    .reduce((sum, invoice) => sum + invoice.total, 0);

  // Revenus du mois précédent pour comparaison
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
  const lastMonthRevenue = invoices
    .filter(invoice => {
      const invoiceDate = new Date(invoice.date);
      return invoiceDate.getMonth() === lastMonth && 
             invoiceDate.getFullYear() === lastMonthYear &&
             invoice.status === 'paid';
    })
    .reduce((sum, invoice) => sum + invoice.total, 0);

  // Calcul du pourcentage de croissance
  const revenueGrowth = lastMonthRevenue > 0 
    ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue * 100)
    : 0;

  // Factures en attente
  const pendingInvoices = invoices.filter(invoice => invoice.status === 'pending');
  const pendingAmount = pendingInvoices.reduce((sum, invoice) => sum + invoice.total, 0);

  // Produits en rupture de stock
  const lowStockProducts = products.filter(product => product.stock <= product.minStock);

  // Nouveaux clients ce mois
  const newClientsThisMonth = clients.filter(client => {
    const clientDate = new Date(client.createdAt || client.date || today);
    return clientDate.getMonth() === currentMonth && 
           clientDate.getFullYear() === currentYear;
  }).length;

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = "gold" }) => (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gold-200/20 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-500/10 border border-${color}-500/20 group-hover:bg-${color}-500/20 transition-colors`}>
          <Icon className={`h-6 w-6 text-${color}-400`} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend === 'up' ? (
              <TrendingUpIcon className="h-4 w-4" />
            ) : (
              <TrendingDownIcon className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">{Math.abs(trendValue).toFixed(1)}%</span>
          </div>
        )}
      </div>
      
      <h3 className="text-gray-300 text-sm font-medium mb-2">{title}</h3>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      {subtitle && (
        <p className="text-gray-400 text-sm">{subtitle}</p>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Revenus du Mois"
        value={`${monthlyRevenue.toLocaleString()} FCFA`}
        subtitle="Factures payées"
        icon={CurrencyDollarIcon}
        trend={revenueGrowth >= 0 ? 'up' : 'down'}
        trendValue={revenueGrowth}
        color="gold"
      />
      
      <StatCard
        title="En Attente"
        value={`${pendingAmount.toLocaleString()} FCFA`}
        subtitle={`${pendingInvoices.length} facture${pendingInvoices.length > 1 ? 's' : ''}`}
        icon={DocumentTextIcon}
        color="blue"
      />
      
      <StatCard
        title="Stock Faible"
        value={lowStockProducts.length}
        subtitle="Produits à réapprovisionner"
        icon={ShoppingBagIcon}
        color={lowStockProducts.length > 0 ? "red" : "emerald"}
      />
      
      <StatCard
        title="Nouveaux Clients"
        value={newClientsThisMonth}
        subtitle="Ce mois-ci"
        icon={UsersIcon}
        color="emerald"
      />
    </div>
  );
};

export default QuickStats;
