import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  HomeIcon,
  CubeIcon,
  UsersIcon,
  DocumentTextIcon,
  PlusIcon,
  ChartBarIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { ui, actions, settings } = useApp();
  const location = useLocation();

  const navigation = [
    { name: 'Tableau de bord', href: '/', icon: HomeIcon },
    { name: 'Produits', href: '/products', icon: CubeIcon },
    { name: 'Clients', href: '/clients', icon: UsersIcon },
    { name: 'Factures', href: '/invoices', icon: DocumentTextIcon },
    { name: 'Nouvelle facture', href: '/invoices/create', icon: PlusIcon },
    { name: 'Rapports', href: '/reports', icon: ChartBarIcon },
    { name: 'Bilan Comptable', href: '/financial-statement', icon: BanknotesIcon },
    { name: 'Paramètres', href: '/settings', icon: CogIcon },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {!ui.sidebarCollapsed && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={actions.toggleSidebar} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-30 ${
        ui.sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Logo and toggle */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {!ui.sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">AM</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-primary-600">{settings.businessInfo.name}</h1>
                <p className="text-xs text-gray-500">Système de facturation</p>
              </div>
            </div>
          )}
          
          <button
            onClick={actions.toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-primary-600 hover:bg-gray-100 transition-colors"
          >
            {ui.sidebarCollapsed ? (
              <Bars3Icon className="w-5 h-5" />
            ) : (
              <XMarkIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 mb-1 transition-all duration-200 group ${
                  location.pathname === item.href
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-primary-600'
                }`}
                title={ui.sidebarCollapsed ? item.name : ''}
              >
                <item.icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    location.pathname === item.href
                      ? 'text-white'
                      : 'text-gray-500 group-hover:text-primary-600'
                  }`} 
                />
                {!ui.sidebarCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        {!ui.sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-400 text-center">
              <p className="text-primary-600 font-medium">Version 1.0.0</p>
              <p className="mt-1">© 2024 Al Madinah</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
