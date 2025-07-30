import React from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const { ui, actions, products, invoices } = useApp();
  const location = useLocation();

  // Get page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Tableau de bord';
      case '/products': return 'Gestion des produits';
      case '/clients': return 'Gestion des clients';
      case '/invoices': return 'Liste des factures';
      case '/invoices/create': return 'Nouvelle facture';
      case '/reports': return 'Rapports et statistiques';
      case '/financial-statement': return 'Bilan Comptable';
      case '/settings': return 'Paramètres';
      default: return 'Al Madinah Boutique';
    }
  };

  // Get low stock count for notifications
  const lowStockCount = products.filter(product => product.stock <= product.minStock).length;
  const todayInvoices = invoices.filter(invoice => {
    const today = new Date().toISOString().split('T')[0];
    return invoice.date === today;
  }).length;

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left section - Page title */}
        <div>
          <h1 className="text-xl font-semibold text-primary-600">{getPageTitle()}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
            <span>{new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
            {todayInvoices > 0 && (
              <span className="text-primary-600 font-medium">
                {todayInvoices} facture{todayInvoices > 1 ? 's' : ''} aujourd'hui
              </span>
            )}
          </div>
        </div>

        {/* Right section - Search, notifications, theme toggle, user */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-gray-100 transition-all duration-200 relative">
              <BellIcon className="h-5 w-5" />
              {lowStockCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-pulse">
                  {lowStockCount}
                </span>
              )}
            </button>
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => actions.setTheme(ui.theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-gray-100 transition-all duration-200 relative"
          >
            {ui.theme === 'light' ? (
              <MoonIcon className="h-5 w-5" />
            ) : (
              <SunIcon className="h-5 w-5" />
            )}
          </button>

          {/* User menu */}
          <div className="relative">
            <button className="flex items-center space-x-2 p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-gray-100 transition-all duration-200">
              <UserCircleIcon className="h-6 w-6" />
              <span className="hidden md:block text-sm font-medium text-gray-300">
                Admin
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
